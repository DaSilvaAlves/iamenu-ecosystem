import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { notificationsService } from '../services/notifications.service';
import { postsService } from '../services/posts.service';
import { reactionsService } from '../services/reactions.service';
import { PrismaClient } from '@prisma/client-community';

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

  /**
   * POST /api/v1/community/comments/:id/react
   * Toggle reaction on a comment
   */
  async toggleReaction(req: Request, res: Response) {
    try {
      const { id } = req.params; // comment ID
      const { reactionType } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      if (!reactionType || !['like', 'useful', 'thanks'].includes(reactionType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid reactionType. Must be: like, useful, or thanks',
        });
      }

      // Toggle the reaction
      const result = await reactionsService.toggleReaction(
        userId,
        'comment',
        id,
        reactionType
      );

      // Create notification if reaction was added
      if (result.action === 'added') {
        try {
          const prisma = new PrismaClient();
          // Get the comment to find the author
          const comment = await prisma.comment.findUnique({
            where: { id },
            select: { authorId: true, body: true, postId: true },
          });

          // Only notify if reactor is not the comment author
          if (comment && comment.authorId !== userId) {
            const emoji = reactionType === 'like' ? '👍' : reactionType === 'useful' ? '💡' : '🙏';

            await notificationsService.createNotification({
              userId: comment.authorId,
              type: 'reaction',
              title: 'Nova reação no teu comentário',
              body: `Alguém reagiu ${emoji} ao teu comentário: "${comment.body.substring(0, 50)}..."`,
              link: `/posts/${comment.postId}`, // Link to the post containing the comment
            });
          }
          await prisma.$disconnect();
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
          // Don't fail the request if notification fails
        }
      }

      res.status(200).json({
        success: true,
        data: result,
        message: `Reaction ${result.action}`,
      });
    } catch (error) {
      console.error('Error toggling reaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle reaction',
      });
    }
  }

  /**
   * GET /api/v1/community/comments/:id/reactions
   * Get reaction counts for a comment
   */
  async getCommentReactions(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reactions = await reactionsService.getReactionCounts('comment', id);

      res.status(200).json({
        success: true,
        data: reactions,
      });
    } catch (error) {
      console.error('Error fetching reactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reactions',
      });
    }
  }
}

export const commentsController = new CommentsController();
