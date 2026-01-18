import { PrismaClient } from '../../prisma/generated/client'; // Use the generated client with the specific client name

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

export const updateSupplier = async (supplierId: string, data: any) => {
  try {
    // Parse JSON strings from FormData (categories and certifications come as JSON strings)
    // Handle empty strings to avoid JSON.parse errors
    let parsedCategories: string[] = [];
    let parsedCertifications: string[] = [];

    try {
      parsedCategories = typeof data.categories === 'string' && data.categories !== ''
        ? JSON.parse(data.categories)
        : (Array.isArray(data.categories) ? data.categories : []);
    } catch (e) {
      console.error('Error parsing categories:', e);
      parsedCategories = [];
    }

    try {
      parsedCertifications = typeof data.certifications === 'string' && data.certifications !== ''
        ? JSON.parse(data.certifications)
        : (Array.isArray(data.certifications) ? data.certifications : []);
    } catch (e) {
      console.error('Error parsing certifications:', e);
      parsedCertifications = [];
    }

    // Sanitize data: convert empty strings to null for optional fields
    const sanitizedData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided and not empty
    if (data.companyName && data.companyName !== '') {
      sanitizedData.companyName = data.companyName;
    }

    if (data.description !== undefined) {
      sanitizedData.description = data.description || null;
    }

    if (parsedCategories.length > 0) {
      sanitizedData.categories = parsedCategories;
    }

    if (data.locationCity && data.locationCity !== '') {
      sanitizedData.locationCity = data.locationCity;
    }

    if (data.locationRegion && data.locationRegion !== '') {
      sanitizedData.locationRegion = data.locationRegion;
    }

    // Handle boolean - check if it was explicitly set
    if (data.nationalDelivery !== undefined) {
      sanitizedData.nationalDelivery = data.nationalDelivery === 'true' || data.nationalDelivery === true;
    }

    // Handle logo and header images
    if (data.logoUrl && data.logoUrl !== '') {
      sanitizedData.logoUrl = data.logoUrl;
    }

    if (data.headerImageUrl && data.headerImageUrl !== '') {
      sanitizedData.headerImageUrl = data.headerImageUrl;
    }

    // Handle certifications (only update if provided)
    if (data.certifications !== undefined) {
      sanitizedData.certifications = parsedCertifications;
    }

    // Handle optional string fields
    if (data.contactPhone !== undefined) {
      sanitizedData.contactPhone = data.contactPhone && data.contactPhone !== '' ? data.contactPhone : null;
    }

    if (data.contactEmail !== undefined) {
      sanitizedData.contactEmail = data.contactEmail && data.contactEmail !== '' ? data.contactEmail : null;
    }

    if (data.contactWebsite !== undefined) {
      sanitizedData.contactWebsite = data.contactWebsite && data.contactWebsite !== '' ? data.contactWebsite : null;
    }

    if (data.deliveryCost !== undefined) {
      sanitizedData.deliveryCost = data.deliveryCost && data.deliveryCost !== '' ? data.deliveryCost : null;
    }

    if (data.deliveryFrequency !== undefined) {
      sanitizedData.deliveryFrequency = data.deliveryFrequency && data.deliveryFrequency !== '' ? data.deliveryFrequency : null;
    }

    // Handle minOrder - must be a valid number or null
    if (data.minOrder !== undefined) {
      if (data.minOrder && data.minOrder !== '') {
        const parsedMinOrder = parseFloat(data.minOrder);
        // Only set if it's a valid number (not NaN)
        sanitizedData.minOrder = !isNaN(parsedMinOrder) ? parsedMinOrder.toString() : null;
      } else {
        sanitizedData.minOrder = null;
      }
    }

    if (data.paymentTerms !== undefined) {
      sanitizedData.paymentTerms = data.paymentTerms && data.paymentTerms !== '' ? data.paymentTerms : null;
    }

    console.log('Updating supplier with data:', JSON.stringify(sanitizedData, null, 2));

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
    console.error('Error updating supplier:', error);
    throw error;
  }
};

// TODO: Implement createSupplier, deleteSupplier
