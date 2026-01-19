import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const QueryMode = Prisma.QueryMode;

// Helper function to calculate price trend
function calculatePriceTrend(priceHistory: { date: Date; price: number }[]): string {
  if (!priceHistory || priceHistory.length < 2) {
    return 'No Data';
  }
  const sortedHistory = [...priceHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHistory = sortedHistory.filter(entry => new Date(entry.date) >= thirtyDaysAgo);

  if (recentHistory.length < 2) {
    return 'No Data';
  }
  const firstPrice = recentHistory[0].price;
  const lastPrice = recentHistory[recentHistory.length - 1].price;
  const trendThreshold = 0.01;

  if (lastPrice > firstPrice * (1 + trendThreshold)) {
    return 'Increasing';
  } else if (lastPrice < firstPrice * (1 - trendThreshold)) {
    return 'Decreasing';
  } else {
    return 'Stable';
  }
}

interface CompareProductsParams {
  search: string;
  filters?: string;
  minPrice?: number;
  maxPrice?: number;
  minMOQ?: number;
  deliveryIncluded?: boolean;
  paymentTerms?: string;
}

export const compareProducts = async (params: CompareProductsParams) => {
  const { search, filters, minPrice, maxPrice, minMOQ, deliveryIncluded, paymentTerms } = params;

  const filtersArray = typeof filters === 'string' && filters.length > 0 ? filters.split(',').map(f => f.trim()) : [];

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search.trim(),
        mode: QueryMode.insensitive,
      },
      AND: [
        ...(filtersArray.length > 0 ? [{
          OR: [
            { category: { in: filtersArray, mode: QueryMode.insensitive } },
            { subcategory: { in: filtersArray, mode: QueryMode.insensitive } },
          ],
        }] : []),
        {
          supplierProducts: {
            some: {
              ...(minPrice !== undefined && { price: { gte: minPrice } }),
              ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
              ...(minMOQ !== undefined && { minQuantity: { gte: minMOQ } }),
              ...(deliveryIncluded !== undefined && { deliveryIncluded: deliveryIncluded }),
              ...(paymentTerms && {
                Supplier: {
                  paymentTerms: { contains: paymentTerms, mode: QueryMode.insensitive }
                }
              })
            }
          }
        }
      ],
    },
    include: {
              supplierProducts: {        include: {
          supplier: true,
        },
      },
              priceHistory: {        orderBy: {
          date: 'asc',
        },
      },
    },
    take: 20,
  });

  const comparativeProducts = products.map((product: any) => {
    const offers = (product.supplierProducts || []).map((sp: any) => {
      const priceHistoryForOffer = (product.priceHistory || [])
        .filter((ph: any) => ph.supplierId === sp.supplierId)
        .map((ph: any) => ({ date: ph.date, price: ph.price?.toNumber?.() || ph.price }));

      const priceTrend = calculatePriceTrend(priceHistoryForOffer);

      return {
        supplierId: sp.supplierId,
        supplierName: sp.supplier.companyName,
        supplierLogo: sp.supplier.logoUrl,
        price: sp.price,
        unit: sp.unit || product.unit,
        minQuantity: sp.minQuantity,
        deliveryIncluded: sp.deliveryIncluded,
        priceHistory: priceHistoryForOffer,
        priceTrend: priceTrend,
      };
    });

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

  return comparativeProducts;
};

export const getProducts = async (search?: string, category?: string, limit: number = 20, offset: number = 0) => {
  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: QueryMode.insensitive };
  }

  if (category) {
    where.category = { contains: category, mode: QueryMode.insensitive };
  }

  const products = await prisma.product.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: {
      name: 'asc',
    },
  });

  const total = await prisma.product.count({ where });

  return {
    products,
    total,
    limit,
    offset,
  };
};
