import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateGroupDto {
  name: string;
  description?: string;
  type?: string; // 'public' | 'private'
  category?: string; // 'region' | 'theme' | 'type'
  createdBy: string;
  coverImage?: string;
}

/**
 * Groups Service
 * Business logic for groups operations
 */
export class GroupsService {
  /**
   * Get all groups with pagination
   */
  async getAllGroups(limit = 50, offset = 0, category?: string) {
    const where = category ? { category } : {};

    const groups = await prisma.group.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        { category: 'asc' }, // Region first, then theme
        { name: 'asc' }      // Alphabetical within category
      ],
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true
          }
        }
      }
    });

    const total = await prisma.group.count({ where });

    return { groups, total, limit, offset };
  }

  /**
   * Get single group by ID
   */
  async getGroupById(id: string) {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true
          }
        },
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            authorId: true,
            category: true,
            createdAt: true,
            views: true,
            likes: true
          }
        }
      }
    });

    return group;
  }

  /**
   * Create new group
   */
  async createGroup(data: CreateGroupDto) {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type || 'public',
        category: data.category,
        createdBy: data.createdBy,
        coverImage: data.coverImage
      }
    });

    return group;
  }

  /**
   * Update group
   */
  async updateGroup(id: string, createdBy: string, data: Partial<CreateGroupDto>) {
    // Verify ownership (only creator can update)
    const group = await prisma.group.findFirst({
      where: { id, createdBy }
    });

    if (!group) {
      return null; // Not found or not owner
    }

    const updated = await prisma.group.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        coverImage: data.coverImage
      }
    });

    return updated;
  }

  /**
   * Delete group
   */
  async deleteGroup(id: string, createdBy: string) {
    // Verify ownership
    const group = await prisma.group.findFirst({
      where: { id, createdBy }
    });

    if (!group) {
      return null;
    }

    await prisma.group.delete({
      where: { id }
    });

    return true;
  }

  /**
   * Get groups by category (region, theme, type)
   */
  async getGroupsByCategory(category: string) {
    return await prisma.group.findMany({
      where: { category },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            memberships: true,
            posts: true
          }
        }
      }
    });
  }
}

export const groupsService = new GroupsService();
