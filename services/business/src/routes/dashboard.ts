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

// GET /sales-trends - Tendências de vendas (hora a hora ou diárias)
router.get('/sales-trends', dashboardController.getSalesTrends.bind(dashboardController));

// GET /ai-prediction - Previsão IA com sugestões
router.get('/ai-prediction', dashboardController.getAIPrediction.bind(dashboardController));

// GET /menu-engineering - Matriz de rentabilidade
router.get('/menu-engineering', dashboardController.getMenuEngineering.bind(dashboardController));

// GET /demand-forecast - Previsão de demanda 7 dias
router.get('/demand-forecast', dashboardController.getDemandForecast.bind(dashboardController));

// GET /peak-hours-heatmap - Mapa de calor horários de pico
router.get('/peak-hours-heatmap', dashboardController.getPeakHoursHeatmap.bind(dashboardController));

// GET /benchmark - Benchmark vs. Setor
router.get('/benchmark', dashboardController.getBenchmark.bind(dashboardController));

export default router;
