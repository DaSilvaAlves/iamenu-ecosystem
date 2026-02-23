import prisma from '../lib/prisma';
import logger from '../lib/logger';

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

export const updateSupplier = async (supplierId: string, data: any) => {
  try {
    // Parse JSON strings from FormData (categories, certifications, deliveryZones come as JSON strings)
    let parsedCategories: string[] = [];
    let parsedCertifications: string[] = [];
    let parsedDeliveryZones: string[] = [];

    const parseJsonArray = (input: any, fieldName: string): string[] => {
      if (Array.isArray(input)) return input;
      if (typeof input === 'string' && input.trim() !== '') {
        try {
          const parsed = JSON.parse(input);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          logger.warn(`Error parsing ${fieldName}`, {
            error: e instanceof Error ? e.message : String(e),
            input
          });
          return [];
        }
      }
      return [];
    };

    parsedCategories = parseJsonArray(data.categories, 'categories');
    parsedCertifications = parseJsonArray(data.certifications, 'certifications');
    parsedDeliveryZones = parseJsonArray(data.deliveryZones, 'deliveryZones');

    // Sanitize data: convert empty strings to null for optional fields
    const sanitizedData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided and not empty
    if (data.companyName !== undefined) {
      sanitizedData.companyName = data.companyName || '';
    }

    if (data.description !== undefined) {
      sanitizedData.description = data.description || null;
    }

    if (data.productsDescription !== undefined) {
      sanitizedData.productsDescription = data.productsDescription || null;
    }

    if (data.categories !== undefined) {
      sanitizedData.categories = parsedCategories;
    }

    if (data.locationCity !== undefined) {
      sanitizedData.locationCity = data.locationCity || null;
    }

    if (data.locationRegion !== undefined) {
      sanitizedData.locationRegion = data.locationRegion || null;
    }

    // Handle boolean - check if it was explicitly set
    if (data.nationalDelivery !== undefined) {
      sanitizedData.nationalDelivery = data.nationalDelivery === 'true' || data.nationalDelivery === true;
    }

    if (data.priceListPublic !== undefined) {
      sanitizedData.priceListPublic = data.priceListPublic === 'true' || data.priceListPublic === true;
    }

    // Handle logo and header images
    if (data.logoUrl !== undefined) {
      sanitizedData.logoUrl = data.logoUrl || null;
    }

    if (data.headerImageUrl !== undefined) {
      sanitizedData.headerImageUrl = data.headerImageUrl || null;
    }

    if (data.catalogPdfUrl !== undefined) {
      sanitizedData.catalogPdfUrl = data.catalogPdfUrl || null;
    }

    // Handle certifications
    if (data.certifications !== undefined) {
      sanitizedData.certifications = parsedCertifications;
    }

    // Handle delivery zones
    if (data.deliveryZones !== undefined) {
      sanitizedData.deliveryZones = parsedDeliveryZones;
    }

    // Handle optional string fields
    if (data.contactPhone !== undefined) {
      sanitizedData.contactPhone = data.contactPhone || null;
    }

    if (data.contactEmail !== undefined) {
      sanitizedData.contactEmail = data.contactEmail || null;
    }

    if (data.contactWebsite !== undefined) {
      sanitizedData.contactWebsite = data.contactWebsite || null;
    }

    if (data.deliveryCost !== undefined) {
      sanitizedData.deliveryCost = data.deliveryCost || null;
    }

    if (data.deliveryFrequency !== undefined) {
      sanitizedData.deliveryFrequency = data.deliveryFrequency || null;
    }

    // Handle minOrder - must be a valid number or null
    if (data.minOrder !== undefined) {
      if (data.minOrder !== null && data.minOrder !== '') {
        const parsedMinOrder = parseFloat(data.minOrder);
        sanitizedData.minOrder = !isNaN(parsedMinOrder) ? parsedMinOrder : null;
      } else {
        sanitizedData.minOrder = null;
      }
    }

    if (data.paymentTerms !== undefined) {
      sanitizedData.paymentTerms = data.paymentTerms || null;
    }

    logger.debug('Updating supplier with data', { supplierId, sanitizedData });

    // Update supplier in database
    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: sanitizedData,
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

    return updatedSupplier;
  } catch (error) {
    logger.error('Error updating supplier', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      supplierId,
      inputData: data
    });
    throw error;
  }
};

// ===================================
// Create Supplier
// ===================================

interface CreateSupplierData {
  userId: string;
  companyName: string;
  description?: string;
  categories?: string[];
  locationCity?: string;
  locationRegion?: string;
  nationalDelivery?: boolean;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  productsDescription?: string;
  certifications?: string[];
  deliveryZones?: string[];
  deliveryCost?: string;
  deliveryFrequency?: string;
  minOrder?: number;
  paymentTerms?: string;
}

export const createSupplier = async (data: CreateSupplierData) => {
  // Validate required fields
  if (!data.userId || !data.companyName) {
    throw new Error('userId and companyName are required');
  }

  // Check if user already has a supplier profile
  const existingSupplier = await prisma.supplier.findFirst({
    where: { userId: data.userId },
  });

  if (existingSupplier) {
    throw new Error('User already has a supplier profile');
  }

  const supplier = await prisma.supplier.create({
    data: {
      userId: data.userId,
      companyName: data.companyName,
      description: data.description || null,
      categories: data.categories || [],
      locationCity: data.locationCity || null,
      locationRegion: data.locationRegion || null,
      nationalDelivery: data.nationalDelivery || false,
      contactPhone: data.contactPhone || null,
      contactEmail: data.contactEmail || null,
      contactWebsite: data.contactWebsite || null,
      logoUrl: data.logoUrl || null,
      headerImageUrl: data.headerImageUrl || null,
      productsDescription: data.productsDescription || null,
      certifications: data.certifications || [],
      deliveryZones: data.deliveryZones || [],
      deliveryCost: data.deliveryCost || null,
      deliveryFrequency: data.deliveryFrequency || null,
      minOrder: data.minOrder || null,
      paymentTerms: data.paymentTerms || null,
    },
    include: {
      reviews: true,
      supplierProducts: {
        include: { product: true },
      },
    },
  });

  return supplier;
};

// ===================================
// Delete Supplier
// ===================================

export const deleteSupplier = async (supplierId: string, userId?: string) => {
  // Check if supplier exists
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      reviews: true,
      supplierProducts: true,
      quotes: true,
    },
  });

  if (!supplier) {
    return null;
  }

  // If userId is provided, verify ownership
  if (userId && supplier.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own supplier profile');
  }

  // Delete related records first (cascade)
  await prisma.$transaction(async (tx) => {
    // Delete reviews
    await tx.review.deleteMany({
      where: { supplierId },
    });

    // Delete supplier products
    await tx.supplierProduct.deleteMany({
      where: { supplierId },
    });

    // Delete quotes
    await tx.quote.deleteMany({
      where: { supplierId },
    });

    // Delete price history
    await tx.priceHistory.deleteMany({
      where: { supplierId },
    });

    // Finally delete the supplier
    await tx.supplier.delete({
      where: { id: supplierId },
    });
  });

  return { deleted: true, supplierId };
};
