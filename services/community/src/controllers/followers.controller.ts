import { Request, Response } from 'express';
import logger from '../lib/logger';
import { followersService } from '../services/followers.service';

/**
 * Followers Controller
 * Handles HTTP requests for following/followers functionality
 */
export class FollowersController {
  /**
   * POST /api/v1/community/profiles/:userId/follow
   * Follow a user
   */
  async followUser(req: Request, res: Response) {
    try {
      const { userId } = req.params; // User to follow
      const followerId = req.user?.userId; // Authenticated user

      if (!followerId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const result = await followersService.followUser(followerId, userId);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Successfully followed user',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error following user failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message === 'Cannot follow yourself' || error.message === 'Already following this user') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to follow user',
      });
    }
  }

  /**
   * DELETE /api/v1/community/profiles/:userId/follow
   * Unfollow a user
   */
  async unfollowUser(req: Request, res: Response) {
    try {
      const { userId } = req.params; // User to unfollow
      const followerId = req.user?.userId; // Authenticated user

      if (!followerId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      await followersService.unfollowUser(followerId, userId);

      res.status(200).json({
        success: true,
        message: 'Successfully unfollowed user',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error unfollowing user failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message === 'Not following this user') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to unfollow user',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/follow/status
   * Check if authenticated user is following this user
   */
  async getFollowStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const followerId = req.user?.userId;

      if (!followerId) {
        return res.status(200).json({
          success: true,
          data: { isFollowing: false },
        });
      }

      const isFollowing = await followersService.isFollowing(followerId, userId);

      res.status(200).json({
        success: true,
        data: { isFollowing },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error checking follow status failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to check follow status',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/followers
   * Get list of followers
   */
  async getFollowers(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await followersService.getFollowers(userId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.followers,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching followers failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch followers',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/following
   * Get list of users being followed
   */
  async getFollowing(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await followersService.getFollowing(userId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.following,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching following failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch following',
      });
    }
  }

  /**
   * GET /api/v1/community/profiles/:userId/follow/counts
   * Get follower and following counts
   */
  async getFollowCounts(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const counts = await followersService.getFollowCounts(userId);

      res.status(200).json({
        success: true,
        data: counts,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching follow counts failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch follow counts',
      });
    }
  }
}

export const followersController = new FollowersController();
