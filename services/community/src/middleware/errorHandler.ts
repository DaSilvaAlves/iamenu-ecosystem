/**
 * Error Handler Middleware - Re-exports from lib/errors.ts
 * Maintains backward compatibility with existing imports
 */
export {
  ApiError,
  ApiError as AppError, // Backward compatibility alias
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  errorHandler,
  asyncHandler
} from '../lib/errors';
