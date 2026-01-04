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
  res.status(501).json({ message: 'Not Implemented: createSupplier' });
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
  res.status(501).json({ message: 'Not Implemented: deleteSupplier' });
});
