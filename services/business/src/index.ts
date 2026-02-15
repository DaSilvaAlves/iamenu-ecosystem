// Sentry must be initialized FIRST, before all other imports
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    serverName: 'business-api',
  });
}

import app from './app';
import logger from './lib/logger';

const PORT = process.env.PORT || 3004;
const API_BASE = process.env.API_BASE || '/api/v1/business';

// ===================================
// Start Server
// ===================================

const server = app.listen(PORT, () => {
  logger.info('Business Intelligence API started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    apiBase: API_BASE,
  });
});

// ===================================
// Error Handling
// ===================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  const errorStack = reason instanceof Error ? reason.stack : undefined;
  logger.error('Unhandled Rejection', {
    error: errorMessage,
    stack: errorStack,
  });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// ===================================
// Graceful Shutdown
// ===================================

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;
