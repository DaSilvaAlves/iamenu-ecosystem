import { PrismaClient } from '@prisma/client-community';
import { notificationsService } from './notifications.service';

const prisma = new PrismaClient();

/**
 * Group Members Service
 * Handles group membership operations (join, leave, roles)
 */
export class GroupMembersService {
  /**
   * Join a group (add membership)
   */
  async joinGroup(groupId: string, userId: string) {
    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if already a member
    const existing = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (existing) {
      throw new Error('Already a member of this group');
    }

    // Create membership
    const membership = await prisma.groupMembership.create({
      data: {
        groupId,
        userId,
        role: 'member',
      },
    });

    // Notify group owner about new member
    if (group.createdBy !== userId) {
      await notificationsService.createNotification({
        userId: group.createdBy,
        type: 'group_join',
        title: 'Novo membro no teu grupo',
        body: `Alguém juntou-se ao grupo "${group.name}"`,
        link: `/groups/${groupId}`,
      });
    }

    return membership;
  }

  /**
   * Leave a group (remove membership)
   */
  async leaveGroup(groupId: string, userId: string) {
    // Check if group creator (cannot leave own group)
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (group?.createdBy === userId) {
      throw new Error('Group creator cannot leave. Delete the group instead.');
    }

    // Remove membership
    const deleted = await prisma.groupMembership.delete({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    return deleted;
  }

  /**
   * Get all members of a group
   */
  async getGroupMembers(groupId: string) {
    const memberships = await prisma.groupMembership.findMany({
      where: { groupId },
      orderBy: [
        { role: 'asc' }, // owner/admin first
        { joinedAt: 'asc' }, // oldest members first
      ],
    });

    return memberships;
  }

  /**
   * Check if user is member of a group
   */
  async isMember(groupId: string, userId: string): Promise<boolean> {
    const membership = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    return !!membership;
  }

  /**
   * Get user's role in a group
   */
  async getUserRole(groupId: string, userId: string): Promise<string | null> {
    const membership = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    return membership?.role || null;
  }

  /**
   * Update member role (admin/moderator operations)
   */
  async updateMemberRole(
    groupId: string,
    targetUserId: string,
    newRole: string,
    requestingUserId: string
  ) {
    // Check if requesting user is owner or admin
    const requestingMembership = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId, userId: requestingUserId },
      },
    });

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    const isOwner = group?.createdBy === requestingUserId;
    const isAdmin = requestingMembership?.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Only group owner or admins can update member roles');
    }

    // Cannot demote yourself if you're the owner
    if (isOwner && targetUserId === requestingUserId && newRole !== 'owner') {
      throw new Error('Group owner cannot demote themselves');
    }

    // Update role
    const updated = await prisma.groupMembership.update({
      where: {
        groupId_userId: { groupId, userId: targetUserId },
      },
      data: {
        role: newRole,
      },
    });

    return updated;
  }

  /**
   * Remove member from group (admin operation)
   */
  async removeMember(
    groupId: string,
    targetUserId: string,
    requestingUserId: string
  ) {
    // Check permissions
    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    const requestingMembership = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: { groupId, userId: requestingUserId },
      },
    });

    const isOwner = group?.createdBy === requestingUserId;
    const isAdmin = requestingMembership?.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Only group owner or admins can remove members');
    }

    // Cannot remove the group creator
    if (group?.createdBy === targetUserId) {
      throw new Error('Cannot remove group creator');
    }

    // Remove membership
    const deleted = await prisma.groupMembership.delete({
      where: {
        groupId_userId: { groupId, userId: targetUserId },
      },
    });

    return deleted;
  }

  /**
   * Get all groups a user is member of
   */
  async getUserGroups(userId: string) {
    const memberships = await prisma.groupMembership.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            _count: {
              select: {
                memberships: true,
                posts: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships.map((m) => ({
      ...m.group,
      userRole: m.role,
      joinedAt: m.joinedAt,
    }));
  }
}

export const groupMembersService = new GroupMembersService();
