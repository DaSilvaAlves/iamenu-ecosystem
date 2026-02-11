// Sentry must be initialized FIRST, before all other imports
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    serverName: 'community-api',
  });
}

import { createServer } from 'http';
import app from './app';
import logger from './lib/logger';

// Import WebSocket service
import { websocketService } from './services/websocket.service';

const PORT = process.env.PORT || 3001;

// ===================================
// Server Start
// ===================================

// Create HTTP server (needed for Socket.io)
const httpServer = createServer(app);

// Initialize WebSocket
websocketService.initialize(httpServer);

const server = httpServer.listen(Number(PORT), '0.0.0.0', () => {
  logger.info('Community API started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    health: `http://localhost:${PORT}/health`,
    api: `http://localhost:${PORT}/api/v1/community`,
    websocket: `ws://localhost:${PORT}`,
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

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
