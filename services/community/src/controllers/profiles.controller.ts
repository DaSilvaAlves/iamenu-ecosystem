import { Request, Response } from 'express';
import { profilesService } from '../services/profiles.service';

/**
 * Profiles Controller
 * Handles HTTP requests for user profiles
 */
export class ProfilesController {
  /**
   * GET /api/v1/community/profiles/:userId
   * Get user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const profile = await profilesService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile',
      });
    }
  }

  /**
   * PATCH /api/v1/community/profiles/:userId
   * Update user profile (only own profile)
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const authUserId = req.user?.userId;

      // Check authorization
      if (userId !== authUserId) {
        return res.status(403).json({
          success: false,
          error: 'You can only update your own profile',
        });
      }

      const {
        restaurantName,
        locationCity,
        locationRegion,
        restaurantType,
        bio,
        badges,
      } = req.body;

      // Get uploaded photo URLs if exists
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const profilePhoto = files?.profilePhoto?.[0] ? `/uploads/${files.profilePhoto[0].filename}` : undefined;
      const coverPhoto = files?.coverPhoto?.[0] ? `/uploads/${files.coverPhoto[0].filename}` : undefined;

      const profile = await profilesService.updateProfile(userId, {
        restaurantName,
        locationCity,
        locationRegion,
        restaurantType,
        bio,
        ...(profilePhoto && { profilePhoto }),
        ...(coverPhoto && { coverPhoto }),
        badges,
      });

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/stats
   * Get user statistics
   */
  async getUserStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const stats = await profilesService.getUserStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user stats',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/posts
   * Get user's posts
   */
  async getUserPosts(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await profilesService.getUserPosts(userId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user posts',
      });
    }
  }
}

export const profilesController = new ProfilesController();
