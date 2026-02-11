/**
 * RLS (Row-Level Security) Middleware for PostgreSQL
 * Sets app.current_user_id session variable for every authenticated request
 * Enables RLS policies to filter data at the database level
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';

/**
 * Middleware to set PostgreSQL session variable for RLS
 * Must run AFTER authentication middleware that sets req.user
 *
 * SECURITY: Validates user context before setting RLS policy variable
 * Prevents NULL user_id from bypassing RLS policies
 */
export const setRLSUserContext = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // SECURITY: Validate user is authenticated and has valid userId
    if (!req.user?.userId) {
      // For protected endpoints, authentication middleware should have rejected this
      // For public endpoints, we proceed without RLS context
      return next();
    }

    // SECURITY: Validate userId is a non-empty string (UUID format)
    if (typeof req.user.userId !== 'string' || !req.user.userId.trim()) {
      logger.warn('Invalid user ID format in RLS context', {
        userId: req.user.userId,
        type: typeof req.user.userId
      });
      return res.status(401).json({
        error: 'INVALID_USER_CONTEXT',
        message: 'User ID is required for RLS policy enforcement'
      });
    }

    // Set PostgreSQL session variable for RLS policies
    // This variable will be available in RLS policies as: current_setting('app.current_user_id')
    await prisma.$executeRaw`SET app.current_user_id = ${req.user.userId}`;

    // SECURITY: Verify session variable was set correctly
    const result = await prisma.$queryRaw<[{ current_user_id: string }]>`
      SELECT current_setting('app.current_user_id') as current_user_id
    `;

    if (!result?.[0]?.current_user_id) {
      logger.error('Failed to set RLS session variable', {
        userId: req.user.userId
      });
      return res.status(500).json({
        error: 'RLS_CONFIGURATION_ERROR',
        message: 'Failed to configure Row-Level Security context'
      });
    }

    // User context validated and RLS session variable set
    next();
  } catch (error) {
    logger.error('RLS middleware error', {
      userId: req.user?.userId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    // Return 500 instead of silently continuing
    // RLS failures should be visible, not hidden
    return res.status(500).json({
      error: 'RLS_SETUP_FAILED',
      message: 'Row-Level Security configuration failed'
    });
  }
};

/**
 * Alternative: Connection pooler compatible approach
 * If using connection pooling, session variables may be lost
 * In that case, pass user_id as a parameter to queries instead:
 *
 * Usage example:
 * const posts = await prisma.post.findMany({
 *   where: {
 *     authorId: req.user.userId  // Filter at application layer
 *   }
 * });
 */
