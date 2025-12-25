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

// Get user gamification data (public)
router.get('/:userId', gamificationController.getUserGamification.bind(gamificationController));

// Check and award badges (auth required, own profile only)
router.post('/:userId/check-badges', authenticateJWT, gamificationController.checkAndAwardBadges.bind(gamificationController));

export default router;
