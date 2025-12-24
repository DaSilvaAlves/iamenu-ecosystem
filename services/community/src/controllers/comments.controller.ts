import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { notificationsService } from '../services/notifications.service';
import { postsService } from '../services/posts.service';

/**
 * Comments Controller
 * Handles HTTP requests for comments
 */
export class CommentsController {
  /**
   * GET /api/v1/community/posts/:postId/comments
   * Get all comments for a post
   */
  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await commentsService.getCommentsByPostId(postId, limit, offset);

      res.status(200).json({
        success: true,
        data: result.comments,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.hasMore,
        },
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch comments',
      });
    }
  }

  /**
   * POST /api/v1/community/posts/:postId/comments
   * Create new comment
   */
  async createComment(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      // Validation
      if (!content || !content.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Content is required',
        });
      }

      // Get user ID from JWT (set by auth middleware)
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const comment = await commentsService.createComment({
        postId,
        authorId,
        body: content.trim(), // Map 'content' from API to 'body' for Prisma
      });

      // Create notification for post author (if not commenting on own post)
      try {
        const post = await postsService.getPostById(postId);
        if (post && post.authorId !== authorId) {
          await notificationsService.createNotification({
            userId: post.authorId,
            type: 'comment',
            title: 'Novo comentário no teu post',
            body: content.trim().substring(0, 100),
            link: `/posts/${postId}`,
          });
        }
      } catch (notifError) {
        console.error('Failed to create notification:', notifError);
        // Don't fail the request if notification fails
      }

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create comment',
      });
    }
  }

  /**
   * DELETE /api/v1/community/posts/:postId/comments/:id
   * Delete comment (only author)
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get user ID from JWT
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      await commentsService.deleteComment(id, authorId);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting comment:', error);

      if (error.message === 'Unauthorized') {
        return res.status(403).json({
          success: false,
          error: 'You can only delete your own comments',
        });
      }

      if (error.message === 'Comment not found') {
        return res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to delete comment',
      });
    }
  }
}

export const commentsController = new CommentsController();
