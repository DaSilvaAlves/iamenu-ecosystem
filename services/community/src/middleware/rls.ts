/**
 * RLS (Row-Level Security) Middleware for PostgreSQL
 * Sets app.current_user_id session variable for every authenticated request
 * Enables RLS policies to filter data at the database level
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

/**
 * Middleware to set PostgreSQL session variable for RLS
 * Must run AFTER authentication middleware that sets req.user
 */
export const setRLSUserContext = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only set if user is authenticated
    if (req.user?.userId) {
      // Execute SQL to set the session variable
      // This variable will be available in RLS policies as: current_setting('app.current_user_id')
      await prisma.$executeRaw`SET app.current_user_id = ${req.user.userId}`;
    }

    next();
  } catch (error) {
    console.error('RLS middleware error:', error);
    // Don't block the request if RLS setup fails
    // But log it for debugging
    next();
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
