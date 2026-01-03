import { PrismaClient } from '@prisma/client-marketplace'; // Use the generated client with the specific client name

const prisma = new PrismaClient();

interface GetSuppliersParams {
  search?: string;
  category?: string;
  location?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}

export const getSuppliers = async (params: GetSuppliersParams) => {
  const { search, category, location, rating, limit = 20, offset = 0 } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { productsDescription: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.categories = { has: category }; // Search within array
  }

  if (location) {
    where.OR = [
      { locationCity: { contains: location, mode: 'insensitive' } },
      { locationRegion: { contains: location, mode: 'insensitive' } },
    ];
  }

if (rating) {
    where.ratingAvg = { gte: rating };
  }

  const suppliers = await prisma.supplier.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: {
      ratingAvg: 'desc', // Default order by rating
    },
  });

  const total = await prisma.supplier.count({ where });

  return {
    suppliers,
    total,
    limit,
    offset,
  };
};

export const getSupplierById = async (supplierId: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
      supplierProducts: {
        include: { product: true },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });
  return supplier;
};

// TODO: Implement createSupplier, updateSupplier, deleteSupplier
