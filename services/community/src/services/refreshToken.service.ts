import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';  // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Refresh token valid for 7 days

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

/**
 * Refresh Token Service
 * Handles JWT refresh token generation, validation, and rotation
 */
export class RefreshTokenService {
  private readonly JWT_SECRET: string;
  private readonly REFRESH_SECRET: string;

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    this.JWT_SECRET = jwtSecret;
    // Use a different secret for refresh tokens (or same + suffix)
    this.REFRESH_SECRET = jwtSecret + '_refresh';
  }

  /**
   * Generate a new access token
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });
  }

  /**
   * Generate a cryptographically secure refresh token
   */
  private generateRefreshTokenString(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Create a new token pair (access + refresh)
   * Stores refresh token in database
   */
  async createTokenPair(
    payload: TokenPayload,
    userAgent?: string,
    ipAddress?: string
  ): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(payload);
    const refreshTokenString = this.generateRefreshTokenString();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: payload.userId,
        expiresAt,
        userAgent,
        ipAddress
      }
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
      expiresIn: 15 * 60 // 15 minutes in seconds
    };
  }

  /**
   * Refresh tokens - validate refresh token and issue new pair
   * Implements token rotation (old refresh token is revoked)
   */
  async refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<TokenPair | null> {
    // Find the refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    // Token not found
    if (!storedToken) {
      return null;
    }

    // Token already revoked (possible token reuse attack)
    if (storedToken.revoked) {
      // Security: Revoke all tokens for this user (potential compromise)
      await this.revokeAllUserTokens(storedToken.userId);
      console.warn(`[SECURITY] Token reuse detected for user ${storedToken.userId}`);
      return null;
    }

    // Token expired
    if (storedToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      return null;
    }

    // Token is valid - rotate it
    // 1. Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revoked: true,
        revokedAt: new Date()
      }
    });

    // 2. Create new token pair
    const payload: TokenPayload = {
      userId: storedToken.userId,
      email: '', // Will be fetched if needed
      role: undefined
    };

    // Fetch user profile to get current email/role
    const profile = await prisma.profile.findUnique({
      where: { userId: storedToken.userId }
    });

    if (profile) {
      payload.role = profile.role || undefined;
    }

    return this.createTokenPair(payload, userAgent, ipAddress);
  }

  /**
   * Revoke a specific refresh token (logout)
   */
  async revokeToken(refreshToken: string): Promise<boolean> {
    try {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: {
          revoked: true,
          revokedAt: new Date()
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoke all refresh tokens for a user (logout all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<number> {
    const result = await prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false
      },
      data: {
        revoked: true,
        revokedAt: new Date()
      }
    });
    return result.count;
  }

  /**
   * Get active sessions for a user
   */
  async getUserSessions(userId: string) {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return tokens;
  }

  /**
   * Clean up expired tokens (run periodically)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            revoked: true,
            revokedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Revoked > 24h ago
          }
        ]
      }
    });
    return result.count;
  }
}

export const refreshTokenService = new RefreshTokenService();
