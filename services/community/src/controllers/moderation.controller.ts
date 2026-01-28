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

  // ============================================
  // QUEUE MANAGEMENT
  // ============================================

  /**
   * GET /api/v1/community/moderation/queue
   * Get prioritized moderation queue (admin/moderator only)
   */
  async getQueue(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await moderationService.getQueue(limit, offset);

      res.status(200).json({
        success: true,
        data: result.queue,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total
        }
      });
    } catch (error: any) {
      console.error('Error fetching queue:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch moderation queue'
      });
    }
  }

  /**
   * GET /api/v1/community/moderation/stats
   * Get queue statistics (admin/moderator only)
   */
  async getQueueStats(req: Request, res: Response) {
    try {
      const stats = await moderationService.getQueueStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch queue stats'
      });
    }
  }

  /**
   * POST /api/v1/community/moderation/bulk-approve
   * Bulk approve all reports for a target (admin only)
   */
  async bulkApprove(req: Request, res: Response) {
    try {
      const { targetType, targetId, notes } = req.body;

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (!targetType || !targetId) {
        return res.status(400).json({
          success: false,
          error: 'targetType and targetId are required'
        });
      }

      const result = await moderationService.bulkApproveReports(
        targetType,
        targetId,
        req.user.userId,
        notes
      );

      res.status(200).json({
        success: true,
        data: result,
        message: `${result.processed} report(s) approved and content removed`
      });
    } catch (error: any) {
      console.error('Error bulk approving:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to bulk approve'
      });
    }
  }

  /**
   * POST /api/v1/community/moderation/bulk-reject
   * Bulk reject all reports for a target (admin only)
   */
  async bulkReject(req: Request, res: Response) {
    try {
      const { targetType, targetId, notes } = req.body;

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (!targetType || !targetId) {
        return res.status(400).json({
          success: false,
          error: 'targetType and targetId are required'
        });
      }

      const result = await moderationService.bulkRejectReports(
        targetType,
        targetId,
        req.user.userId,
        notes
      );

      res.status(200).json({
        success: true,
        data: result,
        message: `${result.processed} report(s) rejected`
      });
    } catch (error: any) {
      console.error('Error bulk rejecting:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to bulk reject'
      });
    }
  }

  // ============================================
  // USER MODERATION
  // ============================================

  /**
   * POST /api/v1/community/moderation/users/:userId/warn
   * Issue warning to user (admin only)
   */
  async warnUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { reason, details, reportId } = req.body;

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (!reason) {
        return res.status(400).json({ success: false, error: 'reason is required' });
      }

      const warning = await moderationService.warnUser(
        userId,
        req.user.userId,
        reason,
        details,
        reportId
      );

      res.status(200).json({
        success: true,
        data: warning,
        message: 'Warning issued successfully'
      });
    } catch (error: any) {
      console.error('Error warning user:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to warn user'
      });
    }
  }

  /**
   * POST /api/v1/community/moderation/users/:userId/ban
   * Ban user (admin only)
   */
  async banUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { reason, durationDays } = req.body;

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (!reason) {
        return res.status(400).json({ success: false, error: 'reason is required' });
      }

      const ban = await moderationService.banUser(
        userId,
        req.user.userId,
        reason,
        durationDays || 0
      );

      res.status(200).json({
        success: true,
        data: ban,
        message: durationDays ? `User banned for ${durationDays} days` : 'User permanently banned'
      });
    } catch (error: any) {
      console.error('Error banning user:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to ban user'
      });
    }
  }

  /**
   * DELETE /api/v1/community/moderation/users/:userId/ban
   * Unban user (admin only)
   */
  async unbanUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      await moderationService.unbanUser(userId, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'User unbanned successfully'
      });
    } catch (error: any) {
      console.error('Error unbanning user:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to unban user'
      });
    }
  }

  /**
   * GET /api/v1/community/moderation/users/:userId/history
   * Get user moderation history (admin only)
   */
  async getUserHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const history = await moderationService.getUserModerationHistory(userId);

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      console.error('Error fetching user history:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch user history'
      });
    }
  }

  // ============================================
  // AUDIT LOG
  // ============================================

  /**
   * GET /api/v1/community/moderation/logs
   * Get moderation action logs (admin only)
   */
  async getLogs(req: Request, res: Response) {
    try {
      const { moderatorId, action, targetType } = req.query;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await moderationService.getModerationLogs(
        {
          moderatorId: moderatorId as string,
          action: action as string,
          targetType: targetType as string
        },
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          hasMore: result.offset + result.limit < result.total
        }
      });
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch moderation logs'
      });
    }
  }
}

export const moderationController = new ModerationController();
