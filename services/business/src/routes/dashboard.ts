import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Dashboard Routes
 * Base: /api/v1/business/dashboard
 */

// All routes require authentication
router.use(authenticateJWT);

// GET /stats - Estatísticas gerais
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// GET /top-products - Top produtos
router.get('/top-products', dashboardController.getTopProducts.bind(dashboardController));

// GET /alerts - Alertas críticos
router.get('/alerts', dashboardController.getAlerts.bind(dashboardController));

// GET /opportunities - Oportunidades
router.get('/opportunities', dashboardController.getOpportunities.bind(dashboardController));

export default router;
