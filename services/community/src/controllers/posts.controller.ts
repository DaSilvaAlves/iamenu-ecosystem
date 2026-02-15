import { Request, Response } from 'express';
import logger from '../lib/logger';
import { postsService } from '../services/posts.service';
import { notificationsService } from '../services/notifications.service';

/**
 * Posts Controller
 * Handles HTTP requests for posts
 */
export class PostsController {
  /**
   * GET /api/v1/community/posts
   * List all posts
   */
  async getAllPosts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const groupId = req.query.groupId as string | undefined;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const sortBy = (req.query.sortBy as 'recent' | 'popular' | 'commented') || 'recent';
      const userGroupIds = req.query.userGroupIds
        ? (typeof req.query.userGroupIds === 'string'
          ? req.query.userGroupIds.split(',')
          : req.query.userGroupIds as string[])
        : undefined;

      const result = await postsService.getAllPosts(limit, offset, groupId, search, category, sortBy, userGroupIds);

      res.status(200).json({
        success: true,
        data: result?.posts || [],
        pagination: {
          total: result?.total || 0,
          limit: result?.limit || limit,
          offset: result?.offset || offset,
          hasMore: (result?.offset || 0) + (result?.limit || limit) < (result?.total || 0),
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching posts failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch posts',
      });
    }
  }

  /**
   * GET /api/v1/community/posts/:id
   * Get single post by ID
   */
  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await postsService.getPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching post failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch post',
      });
    }
  }

  /**
   * POST /api/v1/community/posts
   * Create new post
   */
  async createPost(req: Request, res: Response) {
    try {
      const { title, body, category, groupId, tags } = req.body;

      // Validation
      if (!title || !body || !category) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, body, category',
        });
      }

      // Get user ID from JWT (set by auth middleware)
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // Get uploaded image URL if exists
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const post = await postsService.createPost({
        authorId,
        title,
        body,
        category,
        groupId,
        tags,
        imageUrl,
      });

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post created successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error creating post failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to create post',
      });
    }
  }

  /**
   * PATCH /api/v1/community/posts/:id
   * Update post
   */
  async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, body, category, tags } = req.body;
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const updated = await postsService.updatePost(id, authorId, {
        title,
        body,
        category,
        tags,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Post not found or you are not the author',
        });
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Post updated successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error updating post failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to update post',
      });
    }
  }

  /**
   * DELETE /api/v1/community/posts/:id
   * Delete post
   */
  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const deleted = await postsService.deletePost(id, authorId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Post not found or you are not the author',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error deleting post failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to delete post',
      });
    }
  }

  /**
   * POST /api/v1/community/posts/:id/react
   * Toggle reaction on a post (add or remove)
   */
  async toggleReaction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reactionType } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      if (!reactionType) {
        return res.status(400).json({
          success: false,
          error: 'reactionType is required',
        });
      }

      const result = await postsService.toggleReaction(userId, id, reactionType);

      // Create notification for post author (if adding reaction and not own post)
      if (result.action === 'added') {
        try {
          const post = await postsService.getPostById(id);
          if (post && post.authorId !== userId) {
            await notificationsService.createNotification({
              userId: post.authorId,
              type: 'reaction',
              title: `Alguém reagiu ao teu post`,
              body: `Recebeste uma reação de ${reactionType}`,
              link: `/posts/${id}`,
            });
          }
        } catch (notifError) {
          const requestLogger = (req as any).logger || logger;
          requestLogger.error('Create notification failed', {
            error: notifError instanceof Error ? notifError.message : String(notifError),
            stack: notifError instanceof Error ? notifError.stack : undefined
          });
          // Don't fail the request if notification fails
        }
      }

      res.status(200).json({
        success: true,
        data: result,
        message: `Reaction ${result.action}`,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error toggling reaction failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to toggle reaction',
      });
    }
  }

  /**
   * GET /api/v1/community/posts/:id/reactions
   * Get reaction counts for a post
   */
  async getPostReactions(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reactions = await postsService.getPostReactions(id);

      res.status(200).json({
        success: true,
        data: reactions,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching reactions failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reactions',
      });
    }
  }
}

export const postsController = new PostsController();
