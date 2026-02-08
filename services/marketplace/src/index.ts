// Sentry must be initialized FIRST, before all other imports
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
    serverName: 'marketplace-api',
  });
}

import app from './app';

const PORT = process.env.PORT || 3002;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   🏪 Marketplace API (iaMenu)                    ║
║   Port: ${PORT}                                       ║
║   Health: http://localhost:${PORT}/health            ║
║   Status: ✅ Running                             ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Error Handling
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection:', reason instanceof Error ? reason.message : reason);
  if (reason instanceof Error) console.error(reason.stack);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Graceful Shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;
