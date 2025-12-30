import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client-marketplace';
import { authenticateJWT } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(process.env.NODE_ENV !== 'production' ? morgan('dev') : morgan('combined'));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'marketplace-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// --- Public Marketplace Routes ---

// GET all suppliers
app.get('/api/v1/marketplace/suppliers', async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      // You can add ordering, filtering, pagination here later
      orderBy: {
        companyName: 'asc',
      },
    });
    res.json(suppliers);
  } catch (error) {
    console.error('🔴 Failed to fetch suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// GET a single supplier by ID with its products
app.get('/api/v1/marketplace/suppliers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        SupplierProducts: {
          include: {
            Product: true, // Include the full product details
          },
        },
      },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    console.error(`🔴 Failed to fetch supplier with id ${id}:`, error);
    res.status(500).json({ error: `Failed to fetch supplier with id ${id}` });
  }
});


app.get('/api/v1/marketplace/public/stats', (req: Request, res: Response) => {
  res.json({
    totalSuppliers: 30,
    totalReviews: 85,
    avgRating: 4.6,
    categoriesCount: 6
  });
});

// Protected routes (placeholder)
app.get('/api/v1/marketplace/*', authenticateJWT, (req: Request, res: Response) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento',
    path: req.path,
    hint: 'Rotas implementadas Semana 3-4'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', service: 'marketplace-api' });
});

// Error handler
app.use(errorHandler);

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

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;
