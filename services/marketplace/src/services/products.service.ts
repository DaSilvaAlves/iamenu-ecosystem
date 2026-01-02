import { PrismaClient } from '@prisma/client-marketplace';

const prisma = new PrismaClient();

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
        mode: 'insensitive',
      },
      AND: [
        ...(filtersArray.length > 0 ? [{
          OR: [
            { category: { in: filtersArray, mode: 'insensitive' } },
            { subcategory: { in: filtersArray, mode: 'insensitive' } },
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
                  paymentTerms: { contains: paymentTerms, mode: 'insensitive' }
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

  const comparativeProducts = products.map(product => {
    const offers = product.supplierProducts.map(sp => {
      const priceHistoryForOffer = product.priceHistory
        .filter(ph => ph.supplierId === sp.supplierId)
        .map(ph => ({ date: ph.date, price: ph.price.toNumber() }));

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
