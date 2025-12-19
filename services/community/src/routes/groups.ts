import { Router } from 'express';
import { groupsController } from '../controllers/groups.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Groups Routes
 * Base path: /api/v1/community/groups
 */

// Public routes (no auth required for reading)
router.get('/', groupsController.getAllGroups.bind(groupsController));
router.get('/category/:category', groupsController.getGroupsByCategory.bind(groupsController));
router.get('/:id', groupsController.getGroupById.bind(groupsController));

// Protected routes (auth required)
router.post('/', authenticateJWT, groupsController.createGroup.bind(groupsController));
router.patch('/:id', authenticateJWT, groupsController.updateGroup.bind(groupsController));
router.delete('/:id', authenticateJWT, groupsController.deleteGroup.bind(groupsController));

export default router;
