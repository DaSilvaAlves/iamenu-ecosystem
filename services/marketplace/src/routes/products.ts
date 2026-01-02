import { Router } from 'express';
import * as productController from '../controllers/products.controller';

const router = Router();

router.get('/compare', productController.getProductComparison);
router.get('/', productController.getAllProducts); // <--- NEW LINE

export default router;
