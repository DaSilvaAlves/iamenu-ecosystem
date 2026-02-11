/**
 * Request ID Middleware
 *
 * Generates or retrieves a unique request ID for each incoming request
 * This ID is used for distributed tracing across services
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getRequestLogger } from '../lib/logger';

/**
 * Middleware to add request ID to all requests
 *
 * Features:
 * - Generates UUID v4 if no X-Request-ID header exists
 * - Uses existing X-Request-ID if provided (for cross-service tracing)
 * - Attaches request ID to request object
 * - Sets X-Request-ID response header
 * - Creates request-scoped logger with request ID
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate or use existing request ID
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();

  // Attach to request object for use in handlers
  (req as any).id = requestId;
  (req as any).requestId = requestId;

  // Set response header for client
  res.setHeader('X-Request-ID', requestId);

  // Create request-scoped logger with request ID
  (req as any).logger = getRequestLogger(requestId);

  // Store request start time for performance logging
  (req as any).startTime = Date.now();

  // Log incoming request
  (req as any).logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response data for logging
  const originalSend = res.send;
  (res as any).send = function (data: any) {
    const duration = Date.now() - (req as any).startTime;

    // Log response
    (req as any).logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length') || 'unknown',
    });

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

export default requestIdMiddleware;
