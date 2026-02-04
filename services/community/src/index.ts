import { createServer } from 'http';
import app from './app';

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
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🟢 Community API (iaMenu)                      ║
║                                                   ║
║   Port:    ${PORT}                                    ║
║   Env:     ${process.env.NODE_ENV || 'development'}                    ║
║   Health:  http://localhost:${PORT}/health           ║
║   API:     http://localhost:${PORT}/api/v1/community ║
║   WebSocket: ws://localhost:${PORT}                  ║
║                                                   ║
║   Status:  ✅ Running                            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// ===================================
// Error Handling
// ===================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error(reason instanceof Error ? reason.stack : reason);
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

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
