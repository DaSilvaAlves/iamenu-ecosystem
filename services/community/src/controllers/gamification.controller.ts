import { Request, Response } from 'express';
import logger from '../lib/logger';
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
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching achievements failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch achievements',
      });
    }
  }

  /**
   * GET /api/v1/community/gamification/leaderboard
   * Get global leaderboard
   */
  async getLeaderboard(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const leaderboard = await gamificationService.getLeaderboard(limit, offset);

      res.status(200).json({
        success: true,
        data: leaderboard,
        pagination: {
          limit,
          offset,
          hasMore: leaderboard.length === limit,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching leaderboard failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch leaderboard',
      });
    }
  }

  /**
   * GET /api/v1/community/gamification/user/:userId
   * Get gamification data for a user
   */
  async getUserGamification(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const [data, rank, history] = await Promise.all([
        gamificationService.getGamificationData(userId),
        gamificationService.getUserRank(userId),
        gamificationService.getPointsHistory(userId, 10),
      ]);

      res.status(200).json({
        success: true,
        data: {
          ...data,
          rank,
          recentPoints: history,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching user gamification failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user gamification data',
      });
    }
  }

  /**
   * GET /api/v1/community/gamification/user/:userId/history
   * Get points history for a user
   */
  async getPointsHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

      const history = await gamificationService.getPointsHistory(userId, limit);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching points history failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch points history',
      });
    }
  }

  /**
   * GET /api/v1/community/gamification/user/:userId/rank
   * Get user's rank and nearby users
   */
  async getUserRank(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const range = Math.min(parseInt(req.query.range as string) || 5, 10);

      const [rank, nearby] = await Promise.all([
        gamificationService.getUserRank(userId),
        gamificationService.getLeaderboardAroundUser(userId, range),
      ]);

      res.status(200).json({
        success: true,
        data: {
          rank,
          nearby,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching user rank failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user rank',
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
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error checking badges failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to check badges',
      });
    }
  }
}

export const gamificationController = new GamificationController();
