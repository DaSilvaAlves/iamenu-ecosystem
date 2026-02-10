/**
 * RLS Middleware for Business Service
 * SECURITY: Uses parameterized queries to prevent SQL injection
 */
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

/**
 * RLS Middleware - Sets PostgreSQL session variable for Row-Level Security
 * SECURITY: Validates user context and uses parameterized queries
 */
export const rlsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as {
      userId: string;
      email: string;
      role: string;
    };

    const userId = decoded.userId;

    // SECURITY: Validate userId format before setting RLS context
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(401).json({
        error: 'INVALID_USER_ID',
        message: 'User ID is required'
      });
    }

    // SECURITY: Use parameterized query (NOT string concatenation)
    // $executeRaw with template literals automatically parameterizes
    await prisma.$executeRaw`SET app.current_user_id = ${userId}`;

    // SECURITY: Verify session variable was set
    const result = await prisma.$queryRaw<[{ current_user_id: string }]>`
      SELECT current_setting('app.current_user_id') as current_user_id
    `;

    if (!result?.[0]?.current_user_id) {
      return res.status(500).json({
        error: 'RLS_CONFIGURATION_ERROR',
        message: 'Failed to configure Row-Level Security context'
      });
    }

    (req as any).userId = userId;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    console.error('RLS middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Set RLS context for a specific user
 * SECURITY: Uses parameterized query
 */
export const setRLSContext = async (userId: string): Promise<void> => {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new Error('Invalid user ID for RLS context');
  }
  // SECURITY: Parameterized query (NOT string concatenation)
  await prisma.$executeRaw`SET app.current_user_id = ${userId}`;
};

/**
 * Clear RLS context for the current session
 */
export const clearRLSContext = async (): Promise<void> => {
  await prisma.$executeRaw`RESET app.current_user_id`;
};
