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

// ===================================
// Update Review
// ===================================

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { reviewerId, ...updateData } = req.body;

    if (!reviewerId) {
      return res.status(400).json({ message: 'reviewerId is required' });
    }

    const updatedReview = await reviewService.updateReview(reviewId, reviewerId, updateData);

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// ===================================
// Delete Review
// ===================================

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { reviewerId } = req.body;

    const result = await reviewService.deleteReview(reviewId, reviewerId);

    if (!result) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully', ...result });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// ===================================
// Mark Review as Helpful/Unhelpful
// ===================================

export const markAsHelpful = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body; // true = helpful, false = unhelpful

    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ message: 'helpful (boolean) is required' });
    }

    const updatedReview = await reviewService.markAsHelpful(reviewId, helpful);

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error: any) {
    res.status(500).json({ message: 'Error marking review', error: error.message });
  }
};

// ===================================
// Add Supplier Response
// ===================================

export const addSupplierResponse = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { supplierId, response } = req.body;

    if (!supplierId) {
      return res.status(400).json({ message: 'supplierId is required' });
    }
    if (!response) {
      return res.status(400).json({ message: 'response is required' });
    }

    const updatedReview = await reviewService.addSupplierResponse(reviewId, supplierId, response);

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding response', error: error.message });
  }
};
