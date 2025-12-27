import { Router } from 'express';
import { profilesController } from '../controllers/profiles.controller';
import { authenticateJWT } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * Profiles Routes
 * Base path: /api/v1/community/profiles
 */

// Search endpoint - must come before /:userId routes
router.get('/search', profilesController.searchProfiles.bind(profilesController));

// Public routes (anyone can view profiles)
router.get('/:userId', profilesController.getProfile.bind(profilesController));
router.get('/:userId/stats', profilesController.getUserStats.bind(profilesController));
router.get('/:userId/posts', profilesController.getUserPosts.bind(profilesController));

// Protected routes (auth required)
router.patch(
  '/:userId',
  authenticateJWT,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),
  profilesController.updateProfile.bind(profilesController)
);

export default router;
