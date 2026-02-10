/**
 * RLS Middleware Template
 *
 * Usage:
 * 1. Copy this file to: services/[service]/src/middleware/rls.ts
 * 2. Import in your Express app: app.use(rlsMiddleware)
 * 3. Update JWT_SECRET and token extraction logic
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

/**
 * Extract user ID from JWT token
 * Sets PostgreSQL session variable for RLS policies
 */
export const rlsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      // No auth = no session variable set
      // RLS policies will deny access
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify JWT (update JWT_SECRET from environment)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as {
      userId: string;
      email: string;
      role: string;
    };

    const userId = decoded.userId;

    // SET PostgreSQL session variable for RLS
    // This variable will be accessible in RLS policies via:
    // current_setting('app.current_user_id')
    await prisma.$executeRawUnsafe(
      `SET app.current_user_id = '${userId}'`
    );

    // Store in request context for application code
    (req as any).userId = userId;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Auth middleware error' });
  }
};

/**
 * Utility: Extract user ID for manual queries
 * Use this when you need to manually execute queries without middleware
 */
export const extractUserIdFromToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Utility: Set RLS context for testing or background jobs
 * DANGER: Only use in controlled contexts (tests, admin operations)
 */
export const setRLSContext = async (userId: string): Promise<void> => {
  await prisma.$executeRawUnsafe(
    `SET app.current_user_id = '${userId}'`
  );
};

/**
 * Utility: Clear RLS context
 */
export const clearRLSContext = async (): Promise<void> => {
  await prisma.$executeRawUnsafe(`RESET app.current_user_id`);
};
