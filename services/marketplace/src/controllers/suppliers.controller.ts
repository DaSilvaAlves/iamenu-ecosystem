import { Request, Response } from 'express';
import * as supplierService from '../services/suppliers.service';
import { asyncHandler } from '../middleware/errorHandler'; // <--- NEW IMPORT

export const getAllSuppliers = asyncHandler(async (req: Request, res: Response) => { // <--- WRAPPED
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
}); // <--- CLOSED asyncHandler

// TODO: Implement getSupplierById, createSupplier, updateSupplier, deleteSupplier
