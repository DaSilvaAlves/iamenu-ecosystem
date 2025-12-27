import { Request, Response } from 'express';
import { moderationService } from '../services/moderation.service';

export class ModerationController {
  /**
   * POST /api/v1/community/reports
   * Create a new report (authenticated users)
   */
  async createReport(req: Request, res: Response) {
    try {
      const { targetType, targetId, reason, details } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (!targetType || !targetId || !reason) {
        return res.status(400).json({
          success: false,
          error: 'targetType, targetId, and reason are required'
        });
      }

      const report = await moderationService.createReport({
        reporterId: req.user.userId,
        targetType,
        targetId,
        reason,
        details
      });

      res.status(201).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      console.error('Error creating report:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create report'
      });
    }
  }

  /**
   * GET /api/v1/community/reports
   * List all reports (admin only)
   */
  async getReports(req: Request, res: Response) {
    try {
      const status = req.query.status as any;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await moderationService.getReports(status, limit, offset);

      res.status(200).json({
        success: true,
        data: result.reports,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total
        }
      });
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reports'
      });
    }
  }

  /**
   * GET /api/v1/community/reports/:id
   * Get single report with target content details (admin only)
   */
  async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const report = await moderationService.getReportById(id);

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      console.error('Error fetching report:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'Report not found'
      });
    }
  }

  /**
   * PATCH /api/v1/community/reports/:id/review
   * Review a report (admin only)
   */
  async reviewReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action, notes } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          error: 'action must be "approve" or "reject"'
        });
      }

      const report = await moderationService.reviewReport({
        reportId: id,
        action,
        adminId: req.user.userId,
        notes
      });

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      console.error('Error reviewing report:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to review report'
      });
    }
  }

  /**
   * DELETE /api/v1/community/moderate/:targetType/:id
   * Remove content directly (admin only)
   */
  async removeContent(req: Request, res: Response) {
    try {
      const { targetType, id } = req.params;
      const { reason } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (!['post', 'comment'].includes(targetType)) {
        return res.status(400).json({
          success: false,
          error: 'targetType must be "post" or "comment"'
        });
      }

      const result = await moderationService.removeContent(
        targetType as 'post' | 'comment',
        id,
        req.user.userId,
        reason || 'Removed by admin'
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Error removing content:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to remove content'
      });
    }
  }

  /**
   * POST /api/v1/community/moderate/:targetType/:id/restore
   * Restore removed content (admin only)
   */
  async restoreContent(req: Request, res: Response) {
    try {
      const { targetType, id } = req.params;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (!['post', 'comment'].includes(targetType)) {
        return res.status(400).json({
          success: false,
          error: 'targetType must be "post" or "comment"'
        });
      }

      const result = await moderationService.restoreContent(
        targetType as 'post' | 'comment',
        id,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Error restoring content:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to restore content'
      });
    }
  }
}

export const moderationController = new ModerationController();
