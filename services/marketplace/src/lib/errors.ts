/**
 * Unified Error Classes and Handler
 * Standard error handling for all iaMenu services
 */

import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// ===================================
// Error Classes
// ===================================

export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Invalid or expired token') {
    super('INVALID_TOKEN', message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Access denied') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} with ID ${id} not found`, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: Record<string, any>) {
    super('CONFLICT', message, 409, details);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests') {
    super('RATE_LIMITED', message, 429);
  }
}

// ===================================
// Error Handler Middleware
// ===================================

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const requestId = (req as any).requestId || (req as any).id;

  // Log error with correlation ID
  const requestLogger = (req as any).logger || logger;
  requestLogger.error('API error', {
    code,
    message,
    statusCode,
    requestId,
    path: req.path,
    method: req.method,
    userId: (req as any).userId || (req as any).user?.userId,
    stack: err instanceof Error ? err.stack : undefined
  });

  // Send standardized response
  res.status(statusCode).json({
    status: statusCode,
    error: code,
    message,
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// ===================================
// Async Handler Wrapper
// ===================================

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
