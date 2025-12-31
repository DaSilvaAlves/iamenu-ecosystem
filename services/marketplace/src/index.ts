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
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

// GET all collective bargains
app.get('/api/v1/marketplace/collective-bargains', async (req: Request, res: Response) => {
  try {
    const collectiveBargains = await prisma.collectiveBargain.findMany({
      include: {
        Product: true, // Include related product details
        BargainAdhesions: true, // Include all adhesions to calculate stats
      },
      orderBy: {
        deadline: 'asc', // Order by deadline ascending
      },
    });

    // Process each bargain to calculate total committed volume and unique participants
    const processedBargains = collectiveBargains.map(bargain => {
      const totalCommittedVolume = bargain.BargainAdhesions.reduce(
        (sum, adhesion) => sum + adhesion.committedQuantity.toNumber(), // assuming Decimal is converted to number
        0
      );

      const uniqueParticipants = new Set(
        bargain.BargainAdhesions.map(adhesion => adhesion.userId)
      ).size;

      // Determine active status based on deadline and explicit status
      const now = new Date();
      const deadlineDate = bargain.deadline ? new Date(bargain.deadline) : null;
      const isActive = bargain.status === 'open' && deadlineDate && deadlineDate > now;
      const isAchieved = bargain.status === 'closed-achieved' || (bargain.targetParticipants && totalCommittedVolume >= bargain.targetParticipants);


      // Remove raw BargainAdhesions data if not needed in the final response
      const { BargainAdhesions, ...rest } = bargain;

      return {
        ...rest,
        currentParticipants: uniqueParticipants,
        totalCommittedVolume: totalCommittedVolume,
        isActive: isActive,
        isAchieved: isAchieved,
      };
    });

    res.json(processedBargains);
  } catch (error) {
    console.error('🔴 Failed to fetch collective bargains:', error);
    res.status(500).json({ error: 'Failed to fetch collective bargains' });
  }
});

// GET products with comparative prices from various suppliers
app.get('/api/v1/marketplace/products/compare', async (req: Request, res: Response) => {
  const { search } = req.query;

  if (!search || typeof search !== 'string' || search.trim().length < 3) {
    return res.status(400).json({ error: 'Search term is required and must be at least 3 characters long.' });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      },
      include: {
        SupplierProducts: {
          include: {
            Supplier: true, // Include supplier details for each offer
          },
        },
      },
      take: 20, // Limit results to avoid overwhelming responses
    });

    // Transform data to a more comparative friendly format
    const comparativeProducts = products.map(product => {
      const offers = product.SupplierProducts.map(sp => ({
        supplierId: sp.supplierId,
        supplierName: sp.Supplier.companyName,
        supplierLogo: sp.Supplier.logoUrl,
        price: sp.price,
        unit: sp.unit || product.unit,
        minQuantity: sp.minQuantity,
        deliveryIncluded: sp.deliveryIncluded,
        // Add other relevant supplier product details here
      }));

      // Calculate average price if needed
      const validPrices = offers.map(o => o.price.toNumber()).filter(p => p > 0);
      const averagePrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b) / validPrices.length : 0;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        unit: product.unit,
        imageUrl: product.imageUrl,
        description: product.description,
        averagePrice: averagePrice,
        offers: offers,
      };
    });

    res.json(comparativeProducts);
  } catch (error) {
    console.error('🔴 Failed to fetch comparative products:', error);
    res.status(500).json({ error: 'Failed to fetch comparative products' });
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
