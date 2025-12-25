import { Router } from 'express';
import { groupsController } from '../controllers/groups.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * Groups Routes
 * Base path: /api/v1/community/groups
 */

// ===================================
// PUBLIC ROUTES (no auth required)
// ===================================

// List all groups
router.get('/', groupsController.getAllGroups.bind(groupsController));

// Get groups by category
router.get('/category/:category', groupsController.getGroupsByCategory.bind(groupsController));

// Get user's groups
router.get('/user/:userId', groupsController.getUserGroups.bind(groupsController));

// Get single group
router.get('/:id', groupsController.getGroupById.bind(groupsController));

// Get group members
router.get('/:id/members', groupsController.getGroupMembers.bind(groupsController));

// ===================================
// PROTECTED ROUTES (auth required)
// ===================================

// Create group
router.post('/', authenticateJWT, groupsController.createGroup.bind(groupsController));

// Update group
router.patch('/:id', authenticateJWT, groupsController.updateGroup.bind(groupsController));

// Delete group
router.delete('/:id', authenticateJWT, groupsController.deleteGroup.bind(groupsController));

// Join group
router.post('/:id/join', authenticateJWT, groupsController.joinGroup.bind(groupsController));

// Leave group
router.post('/:id/leave', authenticateJWT, groupsController.leaveGroup.bind(groupsController));

// Update member role (admin)
router.patch('/:id/members/:userId/role', authenticateJWT, groupsController.updateMemberRole.bind(groupsController));

// Remove member (admin)
router.delete('/:id/members/:userId', authenticateJWT, groupsController.removeMember.bind(groupsController));

export default router;
