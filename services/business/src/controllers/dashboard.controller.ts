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

  /**
   * GET /api/v1/business/dashboard/sales-trends
   * Tendências de vendas
   */
  async getSalesTrends(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const period = (req.query.period as any) || 'hoje';
      const trends = await dashboardService.getSalesTrends(req.user.userId, period);

      res.json({
        success: true,
        data: trends
      });
    } catch (error: any) {
      console.error('Error getting sales trends:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get sales trends'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/ai-prediction
   * Previsão IA
   */
  async getAIPrediction(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const prediction = await dashboardService.getAIPrediction(req.user.userId);

      res.json({
        success: true,
        data: prediction
      });
    } catch (error: any) {
      console.error('Error getting AI prediction:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get AI prediction'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/menu-engineering
   * Matriz de rentabilidade
   */
  async getMenuEngineering(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const matrix = await dashboardService.getMenuEngineering(req.user.userId);

      res.json({
        success: true,
        data: matrix
      });
    } catch (error: any) {
      console.error('Error getting menu engineering:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get menu engineering data'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/demand-forecast
   * Previsão de demanda 7 dias
   */
  async getDemandForecast(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const forecast = await dashboardService.getDemandForecast(req.user.userId);

      res.json({
        success: true,
        data: forecast
      });
    } catch (error: any) {
      console.error('Error getting demand forecast:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get demand forecast'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/peak-hours-heatmap
   * Mapa de calor horários de pico
   */
  async getPeakHoursHeatmap(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const heatmap = await dashboardService.getPeakHoursHeatmap(req.user.userId);

      res.json({
        success: true,
        data: heatmap
      });
    } catch (error: any) {
      console.error('Error getting peak hours heatmap:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get peak hours heatmap'
      });
    }
  }

  /**
   * GET /api/v1/business/dashboard/benchmark
   * Benchmark vs. Setor
   */
  async getBenchmark(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const benchmark = await dashboardService.getBenchmark(req.user.userId);

      res.json({
        success: true,
        data: benchmark
      });
    } catch (error: any) {
      console.error('Error getting benchmark:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get benchmark data'
      });
    }
  }
}

export const dashboardController = new DashboardController();
