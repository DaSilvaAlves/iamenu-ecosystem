import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePostDto {
  authorId: string;
  groupId?: string;
  title: string;
  body: string;
  category: string;
  tags?: string[];
}

/**
 * Posts Service
 * Handles all database operations for posts
 */
export class PostsService {
  /**
   * Get all posts (with pagination and optional group filter)
   */
  async getAllPosts(limit = 20, offset = 0, groupId?: string) {
    const where = groupId ? { groupId } : {};

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
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
        return {
          ...post,
          reactions,
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

    // Increment views
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

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
