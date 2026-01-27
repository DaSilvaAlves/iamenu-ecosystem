import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import onboardingRouter from './routes/onboarding';
import dashboardRouter from './routes/dashboard';

// Import middleware
import { authenticateJWT } from './middleware/auth';

const app: Application = express();
const PORT = process.env.PORT || 3004;

// ===================================
// Middleware
// ===================================

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
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

// Multer setup for file uploads (Excel)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// ===================================
// Health Check
// ===================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'business-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===================================
// API Routes
// ===================================

const API_BASE = process.env.API_BASE || '/api/v1/business';

// Test endpoint
app.get(`${API_BASE}/test`, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'iaMenu Business API is running!',
    endpoints: [
      'POST /onboarding/setup',
      'GET /onboarding/template',
      'GET /dashboard/stats',
      'GET /dashboard/top-products',
      'GET /dashboard/alerts',
      'GET /dashboard/opportunities'
    ]
  });
});

// Routes
app.use(`${API_BASE}/onboarding`, onboardingRouter);
app.use(`${API_BASE}/dashboard`, dashboardRouter);

// ===================================
// Error Handling
// ===================================

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   iaMenu Business Intelligence API       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                 ║
║   Port: ${PORT}                             ║
║   API Base: ${API_BASE}          ║
╚══════════════════════════════════════════╝
  `);
});

export default app;
// Railway rebuild Mon, Jan 19, 2026  9:46:56 PM
