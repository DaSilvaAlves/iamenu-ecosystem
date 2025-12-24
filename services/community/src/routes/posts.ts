import { Router } from 'express';
import { postsController } from '../controllers/posts.controller';
import { commentsController } from '../controllers/comments.controller';
import { authenticateJWT } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * Posts Routes
 * Base path: /api/v1/community/posts
 */

// Public routes (no auth required for reading)
router.get('/', postsController.getAllPosts.bind(postsController));
router.get('/:id', postsController.getPostById.bind(postsController));

// Protected routes (auth required)
router.post('/', authenticateJWT, upload.single('image'), postsController.createPost.bind(postsController));
router.patch('/:id', authenticateJWT, postsController.updatePost.bind(postsController));
router.delete('/:id', authenticateJWT, postsController.deletePost.bind(postsController));

/**
 * Reactions Routes (nested under posts)
 * Base path: /api/v1/community/posts/:id/react
 */

// Public route - get reaction counts for a post
router.get('/:id/reactions', postsController.getPostReactions.bind(postsController));

// Protected route - toggle reaction (add or remove)
router.post('/:id/react', authenticateJWT, postsController.toggleReaction.bind(postsController));

/**
 * Comments Routes (nested under posts)
 * Base path: /api/v1/community/posts/:postId/comments
 */

// Public route - get comments for a post
router.get('/:postId/comments', commentsController.getCommentsByPostId.bind(commentsController));

// Protected routes - create/delete comments (auth required)
router.post('/:postId/comments', authenticateJWT, commentsController.createComment.bind(commentsController));
router.delete('/:postId/comments/:id', authenticateJWT, commentsController.deleteComment.bind(commentsController));

export default router;
