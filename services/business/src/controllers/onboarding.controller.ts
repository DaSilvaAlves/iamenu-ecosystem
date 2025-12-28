import { Request, Response } from 'express';
import { onboardingService, OnboardingData } from '../services/onboarding.service';

export class OnboardingController {
  /**
   * POST /api/v1/business/onboarding/setup
   * Setup inicial do restaurante
   */
  async setup(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const data: OnboardingData = {
        userId: req.user.userId,
        ...req.body
      };

      // Handle uploaded file if exists
      if (req.file) {
        data.menuFile = req.file.path;
      }

      const result = await onboardingService.setupRestaurant(data);

      res.status(201).json({
        success: true,
        data: {
          restaurantId: result.restaurant.id,
          productsCount: result.products.length,
          insights: result.insights
        },
        message: 'Restaurante configurado com sucesso!'
      });
    } catch (error: any) {
      console.error('Error in onboarding setup:', error);

      if (error.message === 'User already has a restaurant configured') {
        return res.status(400).json({
          success: false,
          error: error.message,
          hint: 'Use o endpoint de atualização para modificar dados existentes'
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Failed to setup restaurant'
      });
    }
  }

  /**
   * GET /api/v1/business/onboarding/template
   * Download template Excel
   */
  async downloadTemplate(req: Request, res: Response) {
    try {
      const buffer = await onboardingService.generateTemplate();

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=template-menu-iamenu.xlsx');
      res.send(buffer);
    } catch (error: any) {
      console.error('Error generating template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate template'
      });
    }
  }

  /**
   * GET /api/v1/business/onboarding/status
   * Ver status do onboarding
   */
  async getStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Usar PrismaClient diretamente
      const { PrismaClient } = await import('@prisma/client-business');
      const prisma = new PrismaClient();

      const restaurant = await prisma.restaurant.findUnique({
        where: { userId: req.user.userId },
        include: {
          settings: true,
          _count: {
            select: {
              products: true,
              orders: true
            }
          }
        }
      });

      if (!restaurant) {
        return res.json({
          success: true,
          data: {
            completed: false,
            hasRestaurant: false
          }
        });
      }

      res.json({
        success: true,
        data: {
          completed: restaurant.onboardingCompleted,
          hasRestaurant: true,
          restaurantName: restaurant.name,
          productsCount: restaurant._count.products,
          ordersCount: restaurant._count.orders
        }
      });
    } catch (error: any) {
      console.error('Error getting onboarding status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get status'
      });
    }
  }
}

export const onboardingController = new OnboardingController();
