import { Request, Response } from 'express';
import * as productService from '../services/products.service';
import { asyncHandler } from '../middleware/errorHandler'; // <--- NEW IMPORT

export const getProductComparison = asyncHandler(async (req: Request, res: Response) => { // <--- WRAPPED
  const { search, filters, minPrice, maxPrice, minMOQ, deliveryIncluded, paymentTerms } = req.query;

  if (!search || typeof search !== 'string' || search.trim().length < 3) {
    return res.status(400).json({ error: 'Search term is required and must be at least 3 characters long.' });
  }

  const result = await productService.compareProducts({
    search: search as string,
    filters: filters as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    minMOQ: minMOQ ? parseInt(minMOQ as string) : undefined,
    deliveryIncluded: deliveryIncluded ? (deliveryIncluded as string).toLowerCase() === 'true' : undefined,
    paymentTerms: paymentTerms as string,
  });

  res.status(200).json(result);
}); // <--- CLOSED asyncHandler
