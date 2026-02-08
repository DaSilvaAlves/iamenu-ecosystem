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

const PORT = process.env.PORT || 3004;
const API_BASE = process.env.API_BASE || '/api/v1/business';

// ===================================
// Start Server
// ===================================

const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   iaMenu Business Intelligence API       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                 ║
║   Port: ${PORT}                             ║
║   API Base: ${API_BASE}          ║
╚══════════════════════════════════════════╝
  `);
});

// ===================================
// Error Handling
// ===================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection:', reason instanceof Error ? reason.message : reason);
  if (reason instanceof Error) console.error(reason.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// ===================================
// Graceful Shutdown
// ===================================

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;
