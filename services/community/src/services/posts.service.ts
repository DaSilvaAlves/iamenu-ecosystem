import { PrismaClient } from '@prisma/client';
import { notificationsService } from './notifications.service';

const prisma = new PrismaClient();

export interface CreatePostDto {
  authorId: string;
  groupId?: string;
  title: string;
  body: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
}

/**
 * Posts Service
 * Handles all database operations for posts
 */
export class PostsService {
  /**
   * Get all posts (with pagination, filters, search, and sorting)
   */
  async getAllPosts(
    limit = 20,
    offset = 0,
    groupId?: string,
    search?: string,
    category?: string,
    sortBy: 'recent' | 'popular' | 'commented' = 'recent'
  ) {
    // Build where clause
    const where: any = {};
    if (groupId) where.groupId = groupId;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy: any;
    switch (sortBy) {
      case 'popular':
        orderBy = { likes: 'desc' };
        break;
      case 'commented':
        orderBy = { comments: { _count: 'desc' } };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy,
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Add reaction counts to each post
    const postsWithReactions = await Promise.all(
      posts.map(async (post) => {
        const reactions = await this.getPostReactions(post.id);
        const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
        return {
          ...post,
          reactions,
          _count: {
            ...post._count,
            reactions: totalReactions,
          },
        };
      })
    );

    const total = await prisma.post.count({ where });

    return {
      posts: postsWithReactions,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get post by ID
   */
  async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) {
      return null;
    }

    return post;
  }

  /**
   * Create new post
   */
  async createPost(data: CreatePostDto) {
    const post = await prisma.post.create({
      data: {
        authorId: data.authorId,
        groupId: data.groupId,
        title: data.title,
        body: data.body,
        category: data.category,
        tags: data.tags ? JSON.stringify(data.tags) : '[]', // SQLite stores arrays as JSON strings
        imageUrl: data.imageUrl,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return post;
  }

  /**
   * Update post (only author can update)
   */
  async updatePost(id: string, authorId: string, data: Partial<CreatePostDto>) {
    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== authorId) {
      return null;
    }

    // Update
    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        category: data.category,
        tags: data.tags,
      },
    });

    return updated;
  }

  /**
   * Delete post (only author can delete)
   */
  async deletePost(id: string, authorId: string) {
    // Verify ownership
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== authorId) {
      return false;
    }

    await prisma.post.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Toggle reaction on a post (add if not exists, remove if exists)
   */
  async toggleReaction(userId: string, postId: string, reactionType: string) {
    // Check if reaction already exists
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_targetType_targetId_reactionType: {
          userId,
          targetType: 'post',
          targetId: postId,
          reactionType,
        },
      },
    });

    if (existing) {
      // Remove reaction
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      return { action: 'removed', reactionType };
    } else {
      // Add reaction
      await prisma.reaction.create({
        data: {
          userId,
          targetType: 'post',
          targetId: postId,
          reactionType,
        },
      });

      // Create notification for post author (if not self-reaction)
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, title: true },
      });

      if (post && post.authorId !== userId) {
        const reactionEmoji = reactionType === 'like' ? '👍' :
                              reactionType === 'useful' ? '💡' :
                              reactionType === 'thanks' ? '🙏' : '❤️';

        await notificationsService.createNotification({
          userId: post.authorId,
          type: 'reaction',
          title: `Nova reação no teu post`,
          body: `Alguém reagiu ${reactionEmoji} no teu post "${post.title}"`,
          link: `/posts/${postId}`,
        });
      }

      return { action: 'added', reactionType };
    }
  }

  /**
   * Get reaction counts for a post
   */
  async getPostReactions(postId: string) {
    const reactions = await prisma.reaction.groupBy({
      by: ['reactionType'],
      where: {
        targetType: 'post',
        targetId: postId,
      },
      _count: {
        reactionType: true,
      },
    });

    // Convert to object { like: 5, useful: 2, thanks: 1 }
    return reactions.reduce((acc, r) => {
      acc[r.reactionType] = r._count.reactionType;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Check if user has reacted to a post
   */
  async getUserReaction(userId: string, postId: string, reactionType: string) {
    const reaction = await prisma.reaction.findUnique({
      where: {
        userId_targetType_targetId_reactionType: {
          userId,
          targetType: 'post',
          targetId: postId,
          reactionType,
        },
      },
    });

    return reaction !== null;
  }
}

export const postsService = new PostsService();
