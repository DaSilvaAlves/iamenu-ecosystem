import { Request, Response } from 'express';
import logger from '../lib/logger';
import { groupsService } from '../services/groups.service';
import { groupMembersService } from '../services/group-members.service';

/**
 * Groups Controller
 * Handles HTTP requests for groups
 */
export class GroupsController {
  /**
   * GET /api/v1/community/groups
   * List all groups (with optional filters, search, and sorting)
   */
  async getAllGroups(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const type = req.query.type as string | undefined;
      const sortBy = (req.query.sortBy as 'name' | 'members' | 'posts' | 'recent') || 'name';

      const result = await groupsService.getAllGroups(limit, offset, category, search, type, sortBy);

      res.status(200).json({
        success: true,
        data: result.groups,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total,
        },
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching groups failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch groups',
      });
    }
  }

  /**
   * GET /api/v1/community/groups/:id
   * Get single group by ID
   */
  async getGroupById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const group = await groupsService.getGroupById(id);

      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'Group not found',
        });
      }

      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch group',
      });
    }
  }

  /**
   * POST /api/v1/community/groups
   * Create new group
   */
  async createGroup(req: Request, res: Response) {
    try {
      const { name, description, type, category } = req.body;

      // Validation
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: name',
        });
      }

      // Get user ID from JWT (set by auth middleware)
      const createdBy = req.user?.userId;

      if (!createdBy) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // Get uploaded cover image URL if exists
      const coverImage = req.file ? `/uploads/${req.file.filename}` : undefined;

      const group = await groupsService.createGroup({
        name,
        description,
        type,
        category,
        createdBy,
        coverImage,
      });

      res.status(201).json({
        success: true,
        data: group,
        message: 'Group created successfully',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error creating group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      // Handle unique constraint violation (duplicate group name)
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Group with this name already exists',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create group',
      });
    }
  }

  /**
   * PATCH /api/v1/community/groups/:id
   * Update group
   */
  async updateGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, type, category, coverImage } = req.body;
      const createdBy = req.user?.userId;

      if (!createdBy) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const updated = await groupsService.updateGroup(id, createdBy, {
        name,
        description,
        type,
        category,
        coverImage,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Group not found or you are not the creator',
        });
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Group updated successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error updating group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to update group',
      });
    }
  }

  /**
   * DELETE /api/v1/community/groups/:id
   * Delete group
   */
  async deleteGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const createdBy = req.user?.userId;

      if (!createdBy) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const deleted = await groupsService.deleteGroup(id, createdBy);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Group not found or you are not the creator',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Group deleted successfully',
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error deleting group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to delete group',
      });
    }
  }

  /**
   * GET /api/v1/community/groups/category/:category
   * Get groups by category
   */
  async getGroupsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;

      const groups = await groupsService.getGroupsByCategory(category);

      res.status(200).json({
        success: true,
        data: groups,
        count: groups.length,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching groups by category failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch groups by category',
      });
    }
  }

  // ===================================
  // MEMBERSHIP ENDPOINTS
  // ===================================

  /**
   * POST /api/v1/community/groups/:id/join
   * Join a group
   */
  async joinGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const membership = await groupMembersService.joinGroup(id, userId);

      res.status(201).json({
        success: true,
        data: membership,
        message: 'Successfully joined the group',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error joining group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message === 'Group not found') {
        return res.status(404).json({
          success: false,
          error: 'Group not found',
        });
      }

      if (error.message === 'Already a member of this group') {
        return res.status(409).json({
          success: false,
          error: 'Already a member of this group',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to join group',
      });
    }
  }

  /**
   * POST /api/v1/community/groups/:id/leave
   * Leave a group
   */
  async leaveGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      await groupMembersService.leaveGroup(id, userId);

      res.status(200).json({
        success: true,
        message: 'Successfully left the group',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error leaving group failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message.includes('creator cannot leave')) {
        return res.status(403).json({
          success: false,
          error: 'Group creator cannot leave. Delete the group instead.',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to leave group',
      });
    }
  }

  /**
   * GET /api/v1/community/groups/:id/members
   * Get all members of a group
   */
  async getGroupMembers(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const members = await groupMembersService.getGroupMembers(id);

      res.status(200).json({
        success: true,
        data: members,
        count: members.length,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching group members failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch group members',
      });
    }
  }

  /**
   * GET /api/v1/community/groups/user/:userId
   * Get all groups a user is member of
   */
  async getUserGroups(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const groups = await groupMembersService.getUserGroups(userId);

      res.status(200).json({
        success: true,
        data: groups,
        count: groups.length,
      });
    } catch (error) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error fetching user groups failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user groups',
      });
    }
  }

  /**
   * PATCH /api/v1/community/groups/:id/members/:userId/role
   * Update member role (admin operation)
   */
  async updateMemberRole(req: Request, res: Response) {
    try {
      const { id, userId: targetUserId } = req.params;
      const { role } = req.body;
      const requestingUserId = req.user?.userId;

      if (!requestingUserId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: role',
        });
      }

      const updated = await groupMembersService.updateMemberRole(
        id,
        targetUserId,
        role,
        requestingUserId
      );

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Member role updated successfully',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error updating member role failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message.includes('Only group owner or admins')) {
        return res.status(403).json({
          success: false,
          error: 'Only group owner or admins can update member roles',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update member role',
      });
    }
  }

  /**
   * DELETE /api/v1/community/groups/:id/members/:userId
   * Remove member from group (admin operation)
   */
  async removeMember(req: Request, res: Response) {
    try {
      const { id, userId: targetUserId } = req.params;
      const requestingUserId = req.user?.userId;

      if (!requestingUserId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      await groupMembersService.removeMember(id, targetUserId, requestingUserId);

      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error: any) {
      const requestLogger = (req as any).logger || logger;
      requestLogger.error('Error removing member failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      if (error.message.includes('Only group owner or admins')) {
        return res.status(403).json({
          success: false,
          error: 'Only group owner or admins can remove members',
        });
      }

      if (error.message.includes('Cannot remove group creator')) {
        return res.status(403).json({
          success: false,
          error: 'Cannot remove group creator',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to remove member',
      });
    }
  }
}

export const groupsController = new GroupsController();
