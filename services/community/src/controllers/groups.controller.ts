import { Request, Response } from 'express';
import { groupsService } from '../services/groups.service';

/**
 * Groups Controller
 * Handles HTTP requests for groups
 */
export class GroupsController {
  /**
   * GET /api/v1/community/groups
   * List all groups (with optional category filter)
   */
  async getAllGroups(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string | undefined;

      const result = await groupsService.getAllGroups(limit, offset, category);

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
      console.error('Error fetching groups:', error);
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
      console.error('Error fetching group:', error);
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
      const { name, description, type, category, coverImage } = req.body;

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
      console.error('Error creating group:', error);

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
      console.error('Error updating group:', error);
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
      console.error('Error deleting group:', error);
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
      console.error('Error fetching groups by category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch groups by category',
      });
    }
  }
}

export const groupsController = new GroupsController();
