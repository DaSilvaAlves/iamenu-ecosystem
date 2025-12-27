import { PrismaClient } from '@prisma/client';
import { notificationsService } from './notifications.service';
import { reactionsService } from './reactions.service';
import { extractMentions, resolveMentions } from '../utils/mention.utils';

const prisma = new PrismaClient();

interface CreateCommentDto {
  postId: string;
  authorId: string;
  body: string;
}

/**
 * Comments Service
 * Business logic for post comments
 */
export class CommentsService {
  /**
   * Get comments for a post
   */
  async getCommentsByPostId(postId: string, limit: number = 20, offset: number = 0) {
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({
        where: { postId },
      }),
    ]);

    // Add reaction counts to each comment
    const commentsWithReactions = await Promise.all(
      comments.map(async (comment) => {
        const reactions = await reactionsService.getReactionCounts('comment', comment.id);
        return {
          ...comment,
          reactions,
        };
      })
    );

    return {
      comments: commentsWithReactions,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Create new comment
   */
  async createComment(data: CreateCommentDto) {
    const comment = await prisma.comment.create({
      data: {
        postId: data.postId,
        authorId: data.authorId,
        body: data.body,
      },
    });

    // Create notification for post author (if not self-comment)
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
      select: { authorId: true, title: true },
    });

    if (post && post.authorId !== data.authorId) {
      await notificationsService.createNotification({
        userId: post.authorId,
        type: 'comment',
        title: 'Novo comentário no teu post',
        body: `Alguém comentou no teu post "${post.title}"`,
        link: `/posts/${data.postId}`,
      });
    }

    // Handle mentions in comment
    try {
      const mentions = extractMentions(data.body);
      if (mentions.length > 0) {
        const mentionMap = await resolveMentions(mentions, prisma);

        for (const [username, userId] of mentionMap) {
          if (userId !== data.authorId) {
            await notificationsService.createNotification({
              userId,
              type: 'mention',
              title: 'Foste mencionado num comentário',
              body: post ? `No post "${post.title}"` : 'Num comentário',
              link: `/posts/${data.postId}`
            });
          }
        }
      }
    } catch (mentionError) {
      console.error('Failed to process mentions:', mentionError);
    }

    return comment;
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string, authorId: string) {
    // Verify ownership
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new Error('Unauthorized');
    }

    await prisma.comment.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const commentsService = new CommentsService();
