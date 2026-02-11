import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import requestIdMiddleware from './middleware/requestId';

// Import routes
import suppliersRouter from './routes/suppliers';
import productsRouter from './routes/products';
import bargainsRouter from './routes/bargains';
import quotesRouter from './routes/quotes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(requestIdMiddleware);
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(process.env.NODE_ENV !== 'production' ? morgan('dev') : morgan('combined'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'marketplace-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/marketplace/suppliers', suppliersRouter);
app.use('/api/v1/marketplace/products', productsRouter);
app.use('/api/v1/marketplace/collective-bargains', bargainsRouter);
app.use('/api/v1/marketplace/quotes', quotesRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', service: 'marketplace-api' });
});

// Error handler
app.use(errorHandler);

export default app;
