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

export const updateSupplier = async (supplierId: string, data: any) => {
  // Parse JSON strings from FormData (categories and certifications come as JSON strings)
  const parsedCategories = typeof data.categories === 'string' ? JSON.parse(data.categories) : data.categories;
  const parsedCertifications = typeof data.certifications === 'string' ? JSON.parse(data.certifications) : (data.certifications || []);

  // Sanitize data: convert empty strings to null for optional fields
  const sanitizedData: any = {
    companyName: data.companyName,
    description: data.description,
    categories: parsedCategories,
    locationCity: data.locationCity,
    locationRegion: data.locationRegion,
    nationalDelivery: data.nationalDelivery === 'true' || data.nationalDelivery === true,
    updatedAt: new Date(),
  };

  // Handle logo and header images
  if (data.logoUrl && data.logoUrl !== '') {
    sanitizedData.logoUrl = data.logoUrl;
  }

  if (data.headerImageUrl && data.headerImageUrl !== '') {
    sanitizedData.headerImageUrl = data.headerImageUrl;
  }

  // Handle certifications
  if (parsedCertifications && parsedCertifications.length > 0) {
    sanitizedData.certifications = parsedCertifications;
  }

  // Only include optional fields if they have values
  if (data.contactPhone && data.contactPhone !== '') {
    sanitizedData.contactPhone = data.contactPhone;
  } else {
    sanitizedData.contactPhone = null;
  }

  if (data.contactEmail && data.contactEmail !== '') {
    sanitizedData.contactEmail = data.contactEmail;
  } else {
    sanitizedData.contactEmail = null;
  }

  if (data.contactWebsite && data.contactWebsite !== '') {
    sanitizedData.contactWebsite = data.contactWebsite;
  } else {
    sanitizedData.contactWebsite = null;
  }

  if (data.deliveryCost && data.deliveryCost !== '') {
    sanitizedData.deliveryCost = data.deliveryCost;
  } else {
    sanitizedData.deliveryCost = null;
  }

  if (data.deliveryFrequency && data.deliveryFrequency !== '') {
    sanitizedData.deliveryFrequency = data.deliveryFrequency;
  } else {
    sanitizedData.deliveryFrequency = null;
  }

  if (data.minOrder && data.minOrder !== '') {
    sanitizedData.minOrder = data.minOrder.toString();
  } else {
    sanitizedData.minOrder = null;
  }

  if (data.paymentTerms && data.paymentTerms !== '') {
    sanitizedData.paymentTerms = data.paymentTerms;
  } else {
    sanitizedData.paymentTerms = null;
  }

  if (data.certifications && data.certifications.length > 0) {
    sanitizedData.certifications = data.certifications;
  }

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
};

// TODO: Implement createSupplier, deleteSupplier
