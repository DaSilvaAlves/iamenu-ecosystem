import { Router } from 'express';
import { postsController } from '../controllers/posts.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Posts Routes
 * Base path: /api/v1/community/posts
 */

// Public routes (no auth required for reading)
router.get('/', postsController.getAllPosts.bind(postsController));
router.get('/:id', postsController.getPostById.bind(postsController));

// Protected routes (auth required)
router.post('/', authenticateJWT, postsController.createPost.bind(postsController));
router.patch('/:id', authenticateJWT, postsController.updatePost.bind(postsController));
router.delete('/:id', authenticateJWT, postsController.deletePost.bind(postsController));

export default router;
