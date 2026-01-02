import { Router } from 'express';
import * as productController from '../controllers/products.controller';

const router = Router();

router.get('/compare', productController.getProductComparison);

export default router;
