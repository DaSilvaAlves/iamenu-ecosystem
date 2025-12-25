import { Request, Response } from 'express';
import { gamificationService } from '../services/gamification.service';

/**
 * Gamification Controller
 * Handles HTTP requests for gamification features
 */
export class GamificationController {
  /**
   * GET /api/v1/community/gamification/achievements
   * Get all available achievements
   */
  async getAllAchievements(req: Request, res: Response) {
    try {
      const achievements = gamificationService.getAllAchievements();

      res.status(200).json({
        success: true,
        data: achievements,
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch achievements',
      });
    }
  }

  /**
   * GET /api/v1/community/gamification/:userId
   * Get gamification data for a user
   */
  async getUserGamification(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const data = await gamificationService.getGamificationData(userId);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error fetching user gamification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user gamification data',
      });
    }
  }

  /**
   * POST /api/v1/community/gamification/:userId/check-badges
   * Check and award new badges to a user
   */
  async checkAndAwardBadges(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user?.userId;

      // Only allow users to check their own badges
      if (userId !== currentUserId) {
        return res.status(403).json({
          success: false,
          error: 'You can only check badges for your own profile',
        });
      }

      const newBadges = await gamificationService.checkAndAwardBadges(userId);

      res.status(200).json({
        success: true,
        data: {
          newBadges,
          count: newBadges.length,
        },
        message: newBadges.length > 0
          ? `Parabéns! Desbloqueaste ${newBadges.length} novo(s) badge(s)!`
          : 'Nenhum badge novo desbloqueado',
      });
    } catch (error) {
      console.error('Error checking badges:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check badges',
      });
    }
  }
}

export const gamificationController = new GamificationController();
