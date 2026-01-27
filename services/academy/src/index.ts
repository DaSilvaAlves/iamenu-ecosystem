import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
// import { authenticateJWT } from './middleware/auth'; // Placeholder
// import { errorHandler } from './middleware/errorHandler'; // Placeholder

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(process.env.NODE_ENV !== 'production' ? morgan('dev') : morgan('combined'));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'academy-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Placeholder routes
app.get('/api/v1/academy/*', (req: Request, res: Response) => {
  res.status(501).json({
    message: 'Endpoint da Academy em desenvolvimento',
    path: req.path,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', service: 'academy-api' });
});

// Error handler
// app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   🎓 Academy API (iaMenu)                        ║
║   Port: ${PORT}                                       ║
║   Health: http://localhost:${PORT}/health            ║
║   Status: ✅ Running                             ║
╚═══════════════════════════════════════════════════╝
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