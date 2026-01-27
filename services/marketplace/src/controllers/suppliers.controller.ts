import { Request, Response } from 'express';
import * as supplierService from '../services/suppliers.service';
import { asyncHandler } from '../middleware/errorHandler';

export const getAllSuppliers = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, location, rating, limit, offset } = req.query;

  const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
  const parsedOffset = offset ? parseInt(offset as string, 10) : undefined;
  const parsedRating = rating ? parseFloat(rating as string) : undefined;

  const result = await supplierService.getSuppliers({
    search: search as string,
    category: category as string,
    location: location as string,
    rating: parsedRating,
    limit: parsedLimit,
    offset: parsedOffset,
  });

  res.status(200).json(result);
});

export const getSupplierById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = await supplierService.getSupplierById(id);

  if (!supplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  res.status(200).json(supplier);
});

export const createSupplier = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  // Process uploaded files if any
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const logoUrl = files?.logoFile?.[0] ? `/uploads/${files.logoFile[0].filename}` : undefined;
  const headerImageUrl = files?.headerFile?.[0] ? `/uploads/${files.headerFile[0].filename}` : undefined;

  // Validate required fields
  if (!data.userId) {
    res.status(400).json({ message: 'userId is required' });
    return;
  }
  if (!data.companyName) {
    res.status(400).json({ message: 'companyName is required' });
    return;
  }

  // Parse arrays if they come as JSON strings (from FormData)
  let categories: string[] = [];
  let certifications: string[] = [];
  let deliveryZones: string[] = [];

  try {
    categories = typeof data.categories === 'string' ? JSON.parse(data.categories) : (data.categories || []);
  } catch { categories = []; }

  try {
    certifications = typeof data.certifications === 'string' ? JSON.parse(data.certifications) : (data.certifications || []);
  } catch { certifications = []; }

  try {
    deliveryZones = typeof data.deliveryZones === 'string' ? JSON.parse(data.deliveryZones) : (data.deliveryZones || []);
  } catch { deliveryZones = []; }

  const supplierData = {
    userId: data.userId,
    companyName: data.companyName,
    description: data.description,
    categories,
    locationCity: data.locationCity,
    locationRegion: data.locationRegion,
    nationalDelivery: data.nationalDelivery === 'true' || data.nationalDelivery === true,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    contactWebsite: data.contactWebsite,
    logoUrl,
    headerImageUrl,
    productsDescription: data.productsDescription,
    certifications,
    deliveryZones,
    deliveryCost: data.deliveryCost,
    deliveryFrequency: data.deliveryFrequency,
    minOrder: data.minOrder ? parseFloat(data.minOrder) : undefined,
    paymentTerms: data.paymentTerms,
  };

  const supplier = await supplierService.createSupplier(supplierData);
  res.status(201).json(supplier);
});

export const updateSupplier = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  // Process uploaded files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const logoUrl = files?.logoFile?.[0] ? `/uploads/${files.logoFile[0].filename}` : undefined;
  const headerImageUrl = files?.headerFile?.[0] ? `/uploads/${files.headerFile[0].filename}` : undefined;

  // Merge file URLs with data
  const updateData = {
    ...data,
    ...(logoUrl && { logoUrl }),
    ...(headerImageUrl && { headerImageUrl })
  };

  const updatedSupplier = await supplierService.updateSupplier(id, updateData);

  if (!updatedSupplier) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  res.status(200).json(updatedSupplier);
});

export const deleteSupplier = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // In a real app, userId would come from authenticated user (req.user.id)
  // For now, we allow admin-level deletion or pass userId in body for ownership check
  const { userId } = req.body;

  const result = await supplierService.deleteSupplier(id, userId);

  if (!result) {
    res.status(404).json({ message: 'Supplier not found' });
    return;
  }

  res.status(200).json({
    message: 'Supplier deleted successfully',
    ...result
  });
});
