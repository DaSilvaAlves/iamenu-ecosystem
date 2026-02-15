import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../lib/logger';
import { refreshTokenService } from '../services/refreshToken.service';

/**
 * Auth Controller
 * Handles authentication endpoints
 */
export class AuthController {
  /**
   * GET /api/v1/community/auth/test-token
   * Generate test JWT token for development
   *
   * WARNING: This endpoint should ONLY exist in development!
   * Remove before production deployment.
   */
  async generateTestToken(req: Request, res: Response) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;

      if (!JWT_SECRET) {
        return res.status(500).json({
          success: false,
          error: 'JWT_SECRET not configured in environment variables'
        });
      }

      // Check if we're in production (safety check)
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: 'Test token endpoint disabled in production'
        });
      }

      // Generate test user data
      const testUser = {
        userId: 'test-user-001',
        email: 'eurico@iamenu.pt',
        role: 'admin'
      };

      // Generate token pair (access + refresh)
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await refreshTokenService.createTokenPair(
        testUser,
        userAgent,
        ipAddress
      );

      res.status(200).json({
        success: true,
        message: 'Test tokens generated',
        warning: '⚠️ Este endpoint é apenas para DEVELOPMENT! Remover em produção.',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: testUser,
        usage: {
          header: 'Authorization: Bearer <accessToken>',
          refresh: 'POST /api/v1/community/auth/refresh with { "refreshToken": "<token>" }'
        }
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error generating test token', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to generate test token'
      });
    }
  }

  /**
   * POST /api/v1/community/auth/refresh
   * Refresh access token using refresh token
   * Implements token rotation for security
   */
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
          hint: 'Send { "refreshToken": "<your-refresh-token>" } in request body'
        });
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await refreshTokenService.refreshTokens(
        refreshToken,
        userAgent,
        ipAddress
      );

      if (!tokens) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
          hint: 'Please login again to get new tokens'
        });
      }

      res.status(200).json({
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error refreshing token', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token'
      });
    }
  }

  /**
   * POST /api/v1/community/auth/logout
   * Revoke refresh token (logout current session)
   */
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      await refreshTokenService.revokeToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error logging out', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to logout'
      });
    }
  }

  /**
   * POST /api/v1/community/auth/logout-all
   * Revoke all refresh tokens for user (logout all devices)
   * Requires authentication
   */
  async logoutAll(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const count = await refreshTokenService.revokeAllUserTokens(req.user.userId);

      res.status(200).json({
        success: true,
        message: `Logged out from ${count} device(s)`
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error logging out all', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to logout from all devices'
      });
    }
  }

  /**
   * GET /api/v1/community/auth/sessions
   * Get active sessions for current user
   * Requires authentication
   */
  async getSessions(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const sessions = await refreshTokenService.getUserSessions(req.user.userId);

      res.status(200).json({
        success: true,
        sessions: sessions.map(s => ({
          id: s.id,
          device: s.userAgent || 'Unknown device',
          ip: s.ipAddress || 'Unknown',
          createdAt: s.createdAt,
          expiresAt: s.expiresAt
        }))
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error getting sessions', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to get sessions'
      });
    }
  }
}

export const authController = new AuthController();
