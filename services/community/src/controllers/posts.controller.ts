import { Request, Response } from 'express';
import { postsService } from '../services/posts.service';

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

      const result = await postsService.getAllPosts(limit, offset);

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
      console.error('Error fetching posts:', error);
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
      console.error('Error fetching post:', error);
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

      const post = await postsService.createPost({
        authorId,
        title,
        body,
        category,
        groupId,
        tags,
      });

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post created successfully',
      });
    } catch (error) {
      console.error('Error creating post:', error);
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
      console.error('Error updating post:', error);
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
      console.error('Error deleting post:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete post',
      });
    }
  }
}

export const postsController = new PostsController();
