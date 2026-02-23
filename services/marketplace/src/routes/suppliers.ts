import { Router } from 'express';
import * as supplierController from '../controllers/suppliers.controller';
import reviewsRouter from './reviews';
import { authenticateJWT } from '../middleware/auth'; // Import authenticateJWT
import { upload } from '../middleware/upload'; // Import upload middleware

const router = Router();

// Routes that do NOT require authentication
router.get('/', supplierController.getAllSuppliers); // List all suppliers

// Nested route for reviews (e.g., /suppliers/:supplierId/reviews)
router.use('/:supplierId/reviews', reviewsRouter);

// Routes that require authentication
router.post('/', authenticateJWT, upload.fields([{ name: 'logoFile', maxCount: 1 }, { name: 'headerFile', maxCount: 1 }]), supplierController.createSupplier); // Create a new supplier
router.get('/:id', supplierController.getSupplierById); // Get supplier by ID (can be public, but could also be protected for specific details)
router.patch('/:id', authenticateJWT, upload.fields([{ name: 'logoFile', maxCount: 1 }, { name: 'headerFile', maxCount: 1 }]), supplierController.updateSupplier); // Update a supplier
router.delete('/:id', authenticateJWT, supplierController.deleteSupplier); // Delete a supplier

export default router;
