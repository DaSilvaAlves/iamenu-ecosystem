import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRouter from './routes/auth';
import postsRouter from './routes/posts';
import groupsRouter from './routes/groups';
import notificationsRouter from './routes/notifications';
import profilesRouter from './routes/profiles';
import gamificationRouter from './routes/gamification';
import moderationRouter from './routes/moderation';

// Import middleware
import { authenticateJWT } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3004;

// ===================================
// Middleware
// ===================================

// Security (with relaxed cross-origin policy for uploads)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Profiles router MUST come before body-parser because it uses
// multer for file uploads (multipart/form-data)
app.use('/api/v1/community/profiles', profilesRouter);

// Body parsing global (for all other routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting (3 posts/day para evitar spam)
const createPostLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // 3 posts por dia
  message: 'Limite de 3 posts/dia atingido. Tenta amanhã!',
  standardHeaders: true,
  legacyHeaders: false,
});

// ===================================
// Health Check (público)
// ===================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'community-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===================================
// API Routes (protegidas)
// ===================================

// Rotas públicas (não precisam auth)
app.get('/api/v1/community/public/stats', (req: Request, res: Response) => {
  // Estatísticas públicas (membros totais, posts totais, etc)
  res.json({
    totalMembers: 47,
    totalPosts: 132,
    totalGroups: 15,
    activeToday: 23
  });
});

// Rotas da API
app.use('/api/v1/community/auth', authRouter); // Auth endpoints (test-token, etc)
app.use('/api/v1/community/posts', postsRouter);
app.use('/api/v1/community/groups', groupsRouter);
app.use('/api/v1/community/notifications', notificationsRouter);
// profiles já registado antes do body-parser (linha 50)
app.use('/api/v1/community/gamification', gamificationRouter);
app.use('/api/v1/community', moderationRouter);

// Placeholder para outras rotas (remover depois)
app.get('/api/v1/community/*', authenticateJWT, (req: Request, res: Response) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento',
    path: req.path,
    hint: 'Outras rotas implementadas Semana 1-2'
  });
});

// ===================================
// Error Handling
// ===================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} não existe`,
    service: 'community-api'
  });
});

// Global error handler
app.use(errorHandler);

// ===================================
// Server Start
// ===================================

const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🟢 Community API (iaMenu)                      ║
║                                                   ║
║   Port:    ${PORT}                                    ║
║   Env:     ${process.env.NODE_ENV || 'development'}                    ║
║   Health:  http://localhost:${PORT}/health           ║
║   API:     http://localhost:${PORT}/api/v1/community ║
║                                                   ║
║   Status:  ✅ Running                            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
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
