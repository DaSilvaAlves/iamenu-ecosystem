import { Router } from 'express';
import * as supplierController from '../controllers/suppliers.controller';
import reviewsRouter from './reviews'; // Import the reviews router
// import { authenticateJWT } from '../../src/middleware/auth'; // Re-use auth middleware from community service

const router = Router();

// Middleware to protect routes (optional for now, but good practice)
// router.use(authenticateJWT); // Apply to all routes in this router

router.get('/', supplierController.getAllSuppliers);

// Nested route for reviews
// This will handle routes like /suppliers/:supplierId/reviews
router.use('/:supplierId/reviews', reviewsRouter);

// TODO: Add routes for getSupplierById, createSupplier, updateSupplier, deleteSupplier

export default router;
