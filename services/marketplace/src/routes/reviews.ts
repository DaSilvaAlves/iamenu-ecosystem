import { Router } from 'express';
import * as reviewController from '../controllers/reviews.controller';
// import { authenticateJWT } from '../../src/middleware/auth';

const router = Router({ mergeParams: true }); // mergeParams is important for nested routes

// GET reviews for a specific supplier
router.get('/', reviewController.getSupplierReviews);

// POST a new review for a specific supplier
// In a real app, this should be protected by authentication
// router.post('/', authenticateJWT, reviewController.createSupplierReview);
router.post('/', reviewController.createSupplierReview);


export default router;
