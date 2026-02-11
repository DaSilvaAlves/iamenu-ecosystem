import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger';

/**
 * Custom Error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Operational errors são esperados

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Captura todos os erros da aplicação e responde consistentemente
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Se é AppError customizado
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else {
    // Erros conhecidos de libraries
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid data format';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    }
  }

  // Log error (só erros não operacionais - inesperados)
  if (!isOperational || statusCode === 500) {
    const requestLogger = (req as any).logger || logger;
    requestLogger.error('Request error', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      statusCode,
      userId: (req as any).user?.userId || 'anonymous'
    });
  }

  // Resposta ao cliente
  const response: any = {
    error: getErrorName(statusCode),
    message: message,
    service: 'community-api',
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Em desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
};

/**
 * Helper: Get error name from status code
 */
function getErrorName(statusCode: number): string {
  const errorNames: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };

  return errorNames[statusCode] || 'Error';
}

/**
 * Async handler wrapper
 * Evita try-catch em todas as rotas async
 *
 * Uso:
 * router.get('/posts', asyncHandler(async (req, res) => {
 *   const posts = await getPosts();
 *   res.json(posts);
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
