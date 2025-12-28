import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  /**
   * GET /api/v1/business/dashboard/stats
   * Estatísticas gerais
   */
  async getStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const period = (req.query.period as any) || 'semana';
      const stats = await dashboardService.getStats(req.user.userId, period);

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Error getting stats:', error);

      if (error.message === 'Restaurant not found') {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not configured. Complete onboarding first.',
          hint: 'POST /onboarding/setup'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get stats'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/top-products
   * Top produtos
   */
  async getTopProducts(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const products = await dashboardService.getTopProducts(req.user.userId, limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error: any) {
      console.error('Error getting top products:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get top products'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/alerts
   * Alertas críticos
   */
  async getAlerts(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const alerts = await dashboardService.getAlerts(req.user.userId);

      res.json({
        success: true,
        data: alerts
      });
    } catch (error: any) {
      console.error('Error getting alerts:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get alerts'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/opportunities
   * Oportunidades
   */
  async getOpportunities(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const opportunities = await dashboardService.getOpportunities(req.user.userId);

      res.json({
        success: true,
        data: opportunities
      });
    } catch (error: any) {
      console.error('Error getting opportunities:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get opportunities'
      });
    }
  }
}

export const dashboardController = new DashboardController();
