import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import logger from './lib/logger';

// Load environment variables
dotenv.config();

// Import routes
import onboardingRouter from './routes/onboarding';
import dashboardRouter from './routes/dashboard';

const app: Application = express();

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
  logger.error('Unhandled application error', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined
  });
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

export default app;
