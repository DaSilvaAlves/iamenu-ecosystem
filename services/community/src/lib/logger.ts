/**
 * Centralized Logger Configuration
 *
 * Uses Winston for structured JSON logging with:
 * - Request ID tracking for distributed tracing
 * - Multiple log levels (ERROR, WARN, INFO, DEBUG)
 * - File rotation (max 5MB, 10 files)
 * - Structured JSON format for easy parsing
 * - Sensitive data redaction (passwords, tokens, API keys)
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { redactSensitiveData } from './redact';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Service name - used in all logs
const SERVICE_NAME = process.env.SERVICE_NAME || 'community';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Determine log level
const LOG_LEVEL = process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

/**
 * JSON format for structured logging
 * Outputs logs in JSON format for easy parsing and analysis
 * Redacts sensitive data before serialization
 */
const jsonFormat = printf((info: any) => {
  const { level, message, timestamp, service, requestId, stack, ...meta } = info;
  
  // Redact sensitive data from meta
  const redactedMeta = redactSensitiveData(meta);
  
  const logEntry: any = {
    timestamp,
    level: level.toUpperCase(),
    service,
    message,
  };

  if (requestId) {
    logEntry.requestId = requestId;
  }

  if (Object.keys(redactedMeta).length > 0) {
    Object.assign(logEntry, redactedMeta);
  }

  if (stack) {
    logEntry.stack = redactSensitiveData(stack);
  }

  return JSON.stringify(logEntry);
});

/**
 * Console format for development
 * Human-readable format with colors for terminal output
 * Redacts sensitive data before display
 */
const consoleFormat = printf((info: any) => {
  const { level, message, timestamp, requestId, stack, ...meta } = info;
  let log = `${timestamp} [${level}]: ${message}`;

  if (requestId) {
    log += ` [ID: ${requestId}]`;
  }

  if (stack) {
    log += `\n${redactSensitiveData(stack)}`;
  }

  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(redactSensitiveData(meta))}`;
  }

  return log;
});

// Create logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { service: SERVICE_NAME },
  transports: [
    // Console transport - human readable
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        consoleFormat
      ),
    }),

    // Error log file - JSON format
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true,
    }),

    // Combined log file - JSON format
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      level: LOG_LEVEL,
      format: jsonFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true,
    }),
  ],
});

// Add debug log file if debug level is enabled
if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'trace') {
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'debug.log'),
    level: 'debug',
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    tailable: true,
  }));
}

export default logger;

/**
 * Create a child logger with request ID for tracking across requests
 * @param requestId - UUID request ID from middleware
 * @param metadata - Additional metadata to include
 * @returns Child logger instance
 */
export const getRequestLogger = (
  requestId: string,
  metadata?: Record<string, any>
) => {
  return logger.child({
    requestId,
    ...metadata,
  });
};

/**
 * Export logger for ES6 imports
 */
export { logger };

// Convenience methods for backward compatibility
export const logInfo = (message: string, meta?: object) => logger.info(message, meta);
export const logError = (message: string, error?: Error | unknown) => {
  if (error instanceof Error) {
    logger.error(message, { errorMessage: error.message, stack: error.stack });
  } else {
    logger.error(message, { error });
  }
};
export const logWarn = (message: string, meta?: object) => logger.warn(message, meta);
export const logDebug = (message: string, meta?: object) => logger.debug(message, meta);
