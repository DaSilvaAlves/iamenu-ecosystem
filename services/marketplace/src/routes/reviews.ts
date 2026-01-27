import { Router } from 'express';
import * as reviewController from '../controllers/reviews.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router({ mergeParams: true }); // mergeParams is important for nested routes

// ===================================
// Review CRUD Operations
// ===================================

// GET reviews for a specific supplier
// GET /suppliers/:supplierId/reviews
router.get('/', reviewController.getSupplierReviews);

// POST a new review for a specific supplier
// POST /suppliers/:supplierId/reviews
router.post('/', authenticateJWT, reviewController.createSupplierReview);

// UPDATE a review
// PATCH /suppliers/:supplierId/reviews/:reviewId
router.patch('/:reviewId', authenticateJWT, reviewController.updateReview);

// DELETE a review
// DELETE /suppliers/:supplierId/reviews/:reviewId
router.delete('/:reviewId', authenticateJWT, reviewController.deleteReview);

// ===================================
// Review Interactions
// ===================================

// Mark a review as helpful/unhelpful
// POST /suppliers/:supplierId/reviews/:reviewId/helpful
router.post('/:reviewId/helpful', reviewController.markAsHelpful);

// Add supplier response to a review
// POST /suppliers/:supplierId/reviews/:reviewId/response
router.post('/:reviewId/response', authenticateJWT, reviewController.addSupplierResponse);

export default router;
