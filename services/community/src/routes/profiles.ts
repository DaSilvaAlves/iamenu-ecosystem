import { Router } from 'express';
import { profilesController } from '../controllers/profiles.controller';
import { followersController } from '../controllers/followers.controller';
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

// Following/Followers routes (public read, auth required for write)
router.get('/:userId/followers', followersController.getFollowers.bind(followersController));
router.get('/:userId/following', followersController.getFollowing.bind(followersController));
router.get('/:userId/follow/counts', followersController.getFollowCounts.bind(followersController));
router.get('/:userId/follow/status', authenticateJWT, followersController.getFollowStatus.bind(followersController));

router.post('/:userId/follow', authenticateJWT, followersController.followUser.bind(followersController));
router.delete('/:userId/follow', authenticateJWT, followersController.unfollowUser.bind(followersController));

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
