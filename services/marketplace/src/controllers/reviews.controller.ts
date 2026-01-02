import { Request, Response } from 'express';
import * as reviewService from '../services/reviews.service';

export const getSupplierReviews = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const { limit, offset } = req.query;

    const parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset as string, 10) : undefined;

    const result = await reviewService.getReviewsForSupplier(supplierId, parsedLimit, parsedOffset);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

export const createSupplierReview = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    // In a real app, reviewerId would come from the authenticated user (req.user.id)
    // For now, we'll get it from the body for testing purposes.
    const { reviewerId, ...reviewData } = req.body;

    if (!reviewerId) {
      return res.status(400).json({ message: 'reviewerId is required' });
    }

    const createdReview = await reviewService.createReview({
      supplierId,
      reviewerId,
      ...reviewData,
    });
    res.status(201).json(createdReview);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// TODO: Implement updateReview, deleteReview controllers
