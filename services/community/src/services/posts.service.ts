import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { cache } from '../lib/cache';
import { notificationsService } from './notifications.service';
import { extractMentions, resolveMentions } from '../utils/mention.utils';

export interface CreatePostDto {
  authorId: string;
  groupId?: string;
  title: string;
  body: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
}

export interface GetAllPostsResult {
  posts: any[];
  total: number;
  limit: number;
  offset: number;
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
    sortBy: 'recent' | 'popular' | 'commented' = 'recent',
    userGroupIds?: string[]
  ): Promise<GetAllPostsResult> {
    // Generate cache key
    const cacheKey = `posts:list:${JSON.stringify({ limit, offset, groupId, search, category, sortBy, userGroupIds })}`;

    // Check cache first (5 minute TTL for list views)
    const cachedPosts = cache.get(cacheKey);
    if (cachedPosts) {
      logger.debug('Cache hit for posts list', { cacheKey });
      return cachedPosts;
    }

    // Build where clause
    const where: any = {
      status: 'active'
    };
    if (userGroupIds && userGroupIds.length > 0) {
      where.groupId = { in: userGroupIds };
    } else if (groupId) {
      where.groupId = groupId;
    }
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } }
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
        author: {
          select: {
            userId: true,
            username: true,
            restaurantName: true,
            profilePhoto: true,
          },
        },
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

    // Create a map for quick lookup (author is now included in posts)
    const authorMap = new Map(posts.map(p => [p.authorId, p.author]));

    // OPTIMIZATION: Batch-load all reactions at once instead of N separate queries
    const postIds = posts.map(p => p.id);
    const allReactions = await prisma.reaction.groupBy({
      by: ['targetId', 'reactionType'],
      where: {
        targetType: 'post',
        targetId: { in: postIds },
      },
      _count: {
        reactionType: true,
      },
    });

    // Create a map for O(1) lookup: postId -> { reactionType -> count }
    const reactionsMap = new Map<string, Record<string, number>>();
    allReactions.forEach(r => {
      if (!reactionsMap.has(r.targetId)) {
        reactionsMap.set(r.targetId, {});
      }
      const postReactions = reactionsMap.get(r.targetId)!;
      postReactions[r.reactionType] = r._count.reactionType;
    });

    // Add reaction counts and author data to each post
    const postsWithReactions = posts.map((post) => {
      const reactions = reactionsMap.get(post.id) || {};
      const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
      const author = authorMap.get(post.authorId);
      return {
        ...post,
        author: author ? {
          userId: author.userId,
          displayName: author.restaurantName || author.username || 'Utilizador',
          profilePhoto: author.profilePhoto,
        } : null,
        reactions,
        _count: {
          ...post._count,
          reactions: totalReactions,
        },
      };
    });

    const total = await prisma.post.count({ where });

    const result = {
      posts: postsWithReactions,
      total,
      limit,
      offset,
    };

    // Cache the result (5 minute TTL)
    cache.set(cacheKey, result, 300);

    return result;
  }

  /**
   * Get post by ID
   */
  async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            userId: true,
            username: true,
            restaurantName: true,
            profilePhoto: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            body: true,
            authorId: true,
            createdAt: true,
            likes: true,
          },
        },
      },
    });

    if (!post || post.status === 'removed') {
      return null;
    }

    return {
      ...post,
      author: post.author ? {
        userId: post.author.userId,
        displayName: post.author.restaurantName || post.author.username || 'Utilizador',
        profilePhoto: post.author.profilePhoto,
      } : null,
    };
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

    // Handle mentions
    try {
      const mentions = extractMentions(data.body);
      if (mentions.length > 0) {
        const mentionMap = await resolveMentions(mentions, prisma);

        for (const [username, userId] of mentionMap) {
          if (userId !== data.authorId) {
            await notificationsService.createNotification({
              userId,
              type: 'mention',
              title: 'Foste mencionado num post',
              body: `No post "${post.title}"`,
              link: `/posts/${post.id}`
            });
          }
        }
      }
    } catch (mentionError) {
      logger.warn('Failed to process mentions', {
        error: mentionError instanceof Error ? mentionError.message : String(mentionError),
        postId: post.id
      });
      // Don't fail post creation if mention processing fails
    }

    // Invalidate cache for posts list (new post added)
    cache.invalidatePattern('posts:list:.*');

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
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
      },
    });

    // Invalidate cache (post updated)
    cache.invalidatePattern('posts:list:.*');
    cache.invalidate(`posts:detail:${id}`);

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

    // Invalidate cache (post deleted)
    cache.invalidatePattern('posts:list:.*');
    cache.invalidate(`posts:detail:${id}`);

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
