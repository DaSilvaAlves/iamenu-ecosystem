import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Gamification Routes
 * Base path: /api/v1/community/gamification
 */

// Get all available achievements (public)
router.get('/achievements', gamificationController.getAllAchievements.bind(gamificationController));

// Get global leaderboard (public)
router.get('/leaderboard', gamificationController.getLeaderboard.bind(gamificationController));

// Get user gamification data (public)
router.get('/user/:userId', gamificationController.getUserGamification.bind(gamificationController));

// Get user points history (public)
router.get('/user/:userId/history', gamificationController.getPointsHistory.bind(gamificationController));

// Get user rank and nearby users (public)
router.get('/user/:userId/rank', gamificationController.getUserRank.bind(gamificationController));

// Check and award badges (auth required, own profile only)
router.post('/user/:userId/check-badges', authenticateJWT, gamificationController.checkAndAwardBadges.bind(gamificationController));

export default router;
