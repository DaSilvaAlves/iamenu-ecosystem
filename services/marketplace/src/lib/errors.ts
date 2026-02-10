/**
 * Unified Error Handler Middleware
 * Applied to all services: Community, Marketplace, Academy, Business
 */

import { Request, Response, NextFunction } from 'express';

// Custom error types
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

// Error handler middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    code,
    message,
    statusCode,
    path: req.path,
    method: req.method,
    userId: (req as any).userId,
    stack: err.stack
  });

  // Send response
  res.status(statusCode).json({
    error: code,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.details && { details: err.details })
  });
};

// Async wrapper to catch errors
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
