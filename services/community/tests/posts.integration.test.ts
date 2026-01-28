/**
 * Posts & Comments Integration Tests
 * US-1.1.1 - Sprint 1 Quality Assurance
 *
 * Tests for: Complete post lifecycle, comments flow, reactions, notifications
 * Coverage Target: End-to-end user journey simulation
 */

// Mock dependencies before imports
const mockNotificationsService = {
  createNotification: jest.fn().mockResolvedValue({ id: 'notif-1' }),
};

const mockReactionsService = {
  getReactionCounts: jest.fn().mockResolvedValue({ like: 0, useful: 0, thanks: 0 }),
};

const mockPrismaMethods = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  comment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  reaction: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
  profile: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  group: {
    findUnique: jest.fn(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockPrismaMethods,
}));

jest.mock('../src/services/notifications.service', () => ({
  notificationsService: mockNotificationsService,
}));

jest.mock('../src/services/reactions.service', () => ({
  reactionsService: mockReactionsService,
}));

// Mock mention utils to avoid complex dependencies
jest.mock('../src/utils/mention.utils', () => ({
  extractMentions: jest.fn().mockReturnValue([]),
  resolveMentions: jest.fn().mockResolvedValue(new Map()),
}));

import { PostsService } from '../src/services/posts.service';
import { CommentsService } from '../src/services/comments.service';

describe('Posts & Comments Integration', () => {
  let postsService: PostsService;
  let commentsService: CommentsService;

  beforeEach(() => {
    postsService = new PostsService();
    commentsService = new CommentsService();
    jest.clearAllMocks();
  });

  describe('Post Lifecycle', () => {
    const mockUser = {
      userId: 'user-1',
      username: 'chef_maria',
      restaurantName: 'Restaurante Maria',
      profilePhoto: 'photo.jpg',
    };

    const mockPost = {
      id: 'post-1',
      authorId: 'user-1',
      title: 'Melhores práticas de cozinha',
      body: 'Partilho convosco algumas dicas...',
      category: 'tips',
      tags: '["cozinha", "dicas"]',
      status: 'active',
      likes: 0,
      createdAt: new Date(),
      group: null,
      _count: { comments: 0 },
    };

    it('GIVEN valid data WHEN createPost THEN returns new post with author', async () => {
      // Arrange
      mockPrismaMethods.post.create.mockResolvedValue(mockPost);

      // Act
      const result = await postsService.createPost({
        authorId: 'user-1',
        title: 'Melhores práticas de cozinha',
        body: 'Partilho convosco algumas dicas...',
        category: 'tips',
        tags: ['cozinha', 'dicas'],
      });

      // Assert
      expect(result.id).toBe('post-1');
      expect(result.title).toBe('Melhores práticas de cozinha');
      expect(mockPrismaMethods.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authorId: 'user-1',
            title: 'Melhores práticas de cozinha',
          }),
        })
      );
    });

    it('GIVEN post exists WHEN getPostById THEN returns post with author details', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue({
        ...mockPost,
        comments: [],
      });
      mockPrismaMethods.profile.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await postsService.getPostById('post-1');

      // Assert
      expect(result).toBeDefined();
      expect(result?.title).toBe('Melhores práticas de cozinha');
      expect(result?.author?.displayName).toBe('Restaurante Maria');
    });

    it('GIVEN removed post WHEN getPostById THEN returns null', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue({
        ...mockPost,
        status: 'removed',
      });

      // Act
      const result = await postsService.getPostById('post-1');

      // Assert
      expect(result).toBeNull();
    });

    it('GIVEN post owner WHEN updatePost THEN updates and returns post', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaMethods.post.update.mockResolvedValue({
        ...mockPost,
        title: 'Título Atualizado',
      });

      // Act
      const result = await postsService.updatePost('post-1', 'user-1', {
        title: 'Título Atualizado',
      });

      // Assert
      expect(result?.title).toBe('Título Atualizado');
    });

    it('GIVEN non-owner WHEN updatePost THEN returns null', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      const result = await postsService.updatePost('post-1', 'other-user', {
        title: 'Hack',
      });

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaMethods.post.update).not.toHaveBeenCalled();
    });

    it('GIVEN post owner WHEN deletePost THEN deletes and returns true', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaMethods.post.delete.mockResolvedValue(mockPost);

      // Act
      const result = await postsService.deletePost('post-1', 'user-1');

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaMethods.post.delete).toHaveBeenCalled();
    });

    it('GIVEN non-owner WHEN deletePost THEN returns false', async () => {
      // Arrange
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      const result = await postsService.deletePost('post-1', 'other-user');

      // Assert
      expect(result).toBe(false);
      expect(mockPrismaMethods.post.delete).not.toHaveBeenCalled();
    });
  });

  describe('Comments Flow', () => {
    const mockPost = {
      id: 'post-1',
      authorId: 'author-1',
      title: 'Test Post',
    };

    const mockComment = {
      id: 'comment-1',
      postId: 'post-1',
      authorId: 'user-2',
      body: 'Ótimo post!',
      status: 'active',
      createdAt: new Date(),
    };

    it('GIVEN valid data WHEN createComment THEN creates comment and notifies author', async () => {
      // Arrange
      mockPrismaMethods.comment.create.mockResolvedValue(mockComment);
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      const result = await commentsService.createComment({
        postId: 'post-1',
        authorId: 'user-2',
        body: 'Ótimo post!',
      });

      // Assert
      expect(result.body).toBe('Ótimo post!');
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'author-1', // Post author gets notified
          type: 'comment',
        })
      );
    });

    it('GIVEN self-comment WHEN createComment THEN does NOT notify self', async () => {
      // Arrange
      mockPrismaMethods.comment.create.mockResolvedValue({
        ...mockComment,
        authorId: 'author-1',
      });
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      await commentsService.createComment({
        postId: 'post-1',
        authorId: 'author-1', // Same as post author
        body: 'Meu próprio comentário',
      });

      // Assert - No notification for self-comment
      expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    });

    it('GIVEN post with comments WHEN getCommentsByPostId THEN returns paginated list', async () => {
      // Arrange
      const mockComments = [
        { ...mockComment, id: 'c1' },
        { ...mockComment, id: 'c2' },
        { ...mockComment, id: 'c3' },
      ];
      mockPrismaMethods.comment.findMany.mockResolvedValue(mockComments);
      mockPrismaMethods.comment.count.mockResolvedValue(3);

      // Act
      const result = await commentsService.getCommentsByPostId('post-1', 10, 0);

      // Assert
      expect(result.comments).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(false);
    });

    it('GIVEN many comments WHEN paginating THEN hasMore is true', async () => {
      // Arrange
      mockPrismaMethods.comment.findMany.mockResolvedValue([mockComment]);
      mockPrismaMethods.comment.count.mockResolvedValue(50);

      // Act
      const result = await commentsService.getCommentsByPostId('post-1', 10, 0);

      // Assert
      expect(result.hasMore).toBe(true);
    });

    it('GIVEN comment owner WHEN deleteComment THEN deletes successfully', async () => {
      // Arrange
      mockPrismaMethods.comment.findUnique.mockResolvedValue(mockComment);
      mockPrismaMethods.comment.delete.mockResolvedValue(mockComment);

      // Act
      const result = await commentsService.deleteComment('comment-1', 'user-2');

      // Assert
      expect(result.success).toBe(true);
    });

    it('GIVEN non-owner WHEN deleteComment THEN throws Unauthorized', async () => {
      // Arrange
      mockPrismaMethods.comment.findUnique.mockResolvedValue(mockComment);

      // Act & Assert
      await expect(commentsService.deleteComment('comment-1', 'hacker'))
        .rejects.toThrow('Unauthorized');
    });

    it('GIVEN non-existent comment WHEN deleteComment THEN throws not found', async () => {
      // Arrange
      mockPrismaMethods.comment.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(commentsService.deleteComment('invalid', 'user-1'))
        .rejects.toThrow('Comment not found');
    });
  });

  describe('Reactions Flow', () => {
    const mockPost = {
      id: 'post-1',
      authorId: 'author-1',
      title: 'Test Post',
    };

    it('GIVEN no existing reaction WHEN toggleReaction THEN adds reaction', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);
      mockPrismaMethods.reaction.create.mockResolvedValue({ id: 'r1' });
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      const result = await postsService.toggleReaction('user-2', 'post-1', 'like');

      // Assert
      expect(result.action).toBe('added');
      expect(result.reactionType).toBe('like');
      expect(mockPrismaMethods.reaction.create).toHaveBeenCalled();
    });

    it('GIVEN existing reaction WHEN toggleReaction THEN removes reaction', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue({ id: 'r1' });
      mockPrismaMethods.reaction.delete.mockResolvedValue({ id: 'r1' });

      // Act
      const result = await postsService.toggleReaction('user-2', 'post-1', 'like');

      // Assert
      expect(result.action).toBe('removed');
      expect(mockPrismaMethods.reaction.delete).toHaveBeenCalled();
    });

    it('GIVEN reaction from other user WHEN toggleReaction THEN notifies post author', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);
      mockPrismaMethods.reaction.create.mockResolvedValue({ id: 'r1' });
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      await postsService.toggleReaction('user-2', 'post-1', 'useful');

      // Assert
      expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'author-1',
          type: 'reaction',
        })
      );
    });

    it('GIVEN self-reaction WHEN toggleReaction THEN does NOT notify self', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);
      mockPrismaMethods.reaction.create.mockResolvedValue({ id: 'r1' });
      mockPrismaMethods.post.findUnique.mockResolvedValue(mockPost);

      // Act
      await postsService.toggleReaction('author-1', 'post-1', 'like');

      // Assert - No notification for self-reaction
      expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    });

    it('GIVEN post with reactions WHEN getPostReactions THEN returns counts', async () => {
      // Arrange
      mockPrismaMethods.reaction.groupBy.mockResolvedValue([
        { reactionType: 'like', _count: { reactionType: 5 } },
        { reactionType: 'useful', _count: { reactionType: 3 } },
        { reactionType: 'thanks', _count: { reactionType: 2 } },
      ]);

      // Act
      const result = await postsService.getPostReactions('post-1');

      // Assert
      expect(result).toEqual({
        like: 5,
        useful: 3,
        thanks: 2,
      });
    });

    it('GIVEN user reacted WHEN getUserReaction THEN returns true', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue({ id: 'r1' });

      // Act
      const result = await postsService.getUserReaction('user-1', 'post-1', 'like');

      // Assert
      expect(result).toBe(true);
    });

    it('GIVEN user not reacted WHEN getUserReaction THEN returns false', async () => {
      // Arrange
      mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);

      // Act
      const result = await postsService.getUserReaction('user-1', 'post-1', 'like');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Feed & Listing', () => {
    const mockPosts = [
      {
        id: 'p1',
        authorId: 'user-1',
        title: 'Post 1',
        body: 'Body 1',
        status: 'active',
        likes: 10,
        createdAt: new Date(),
        group: null,
        _count: { comments: 5 },
      },
      {
        id: 'p2',
        authorId: 'user-2',
        title: 'Post 2',
        body: 'Body 2',
        status: 'active',
        likes: 20,
        createdAt: new Date(),
        group: null,
        _count: { comments: 3 },
      },
    ];

    const mockAuthors = [
      { userId: 'user-1', username: 'chef1', restaurantName: 'Rest 1', profilePhoto: null },
      { userId: 'user-2', username: 'chef2', restaurantName: 'Rest 2', profilePhoto: null },
    ];

    it('GIVEN posts exist WHEN getAllPosts THEN returns with authors and reactions', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaMethods.post.count.mockResolvedValue(2);
      mockPrismaMethods.profile.findMany.mockResolvedValue(mockAuthors);
      mockPrismaMethods.reaction.groupBy.mockResolvedValue([]);

      // Act
      const result = await postsService.getAllPosts(20, 0);

      // Assert
      expect(result.posts).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.posts[0].author).toBeDefined();
    });

    it('GIVEN search term WHEN getAllPosts THEN filters results', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue([mockPosts[0]]);
      mockPrismaMethods.post.count.mockResolvedValue(1);
      mockPrismaMethods.profile.findMany.mockResolvedValue([mockAuthors[0]]);
      mockPrismaMethods.reaction.groupBy.mockResolvedValue([]);

      // Act
      await postsService.getAllPosts(20, 0, undefined, 'Post 1');

      // Assert
      expect(mockPrismaMethods.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: { contains: 'Post 1' } }),
            ]),
          }),
        })
      );
    });

    it('GIVEN category filter WHEN getAllPosts THEN filters by category', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue([]);
      mockPrismaMethods.post.count.mockResolvedValue(0);
      mockPrismaMethods.profile.findMany.mockResolvedValue([]);

      // Act
      await postsService.getAllPosts(20, 0, undefined, undefined, 'tips');

      // Assert
      expect(mockPrismaMethods.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'tips',
          }),
        })
      );
    });

    it('GIVEN sortBy popular WHEN getAllPosts THEN orders by likes desc', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue([]);
      mockPrismaMethods.post.count.mockResolvedValue(0);
      mockPrismaMethods.profile.findMany.mockResolvedValue([]);

      // Act
      await postsService.getAllPosts(20, 0, undefined, undefined, undefined, 'popular');

      // Assert
      expect(mockPrismaMethods.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { likes: 'desc' },
        })
      );
    });

    it('GIVEN sortBy commented WHEN getAllPosts THEN orders by comment count', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue([]);
      mockPrismaMethods.post.count.mockResolvedValue(0);
      mockPrismaMethods.profile.findMany.mockResolvedValue([]);

      // Act
      await postsService.getAllPosts(20, 0, undefined, undefined, undefined, 'commented');

      // Assert
      expect(mockPrismaMethods.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { comments: { _count: 'desc' } },
        })
      );
    });

    it('GIVEN groupId filter WHEN getAllPosts THEN filters by group', async () => {
      // Arrange
      mockPrismaMethods.post.findMany.mockResolvedValue([]);
      mockPrismaMethods.post.count.mockResolvedValue(0);
      mockPrismaMethods.profile.findMany.mockResolvedValue([]);

      // Act
      await postsService.getAllPosts(20, 0, 'group-1');

      // Assert
      expect(mockPrismaMethods.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            groupId: 'group-1',
          }),
        })
      );
    });
  });
});

describe('Complete User Journey', () => {
  let postsService: PostsService;
  let commentsService: CommentsService;

  beforeEach(() => {
    postsService = new PostsService();
    commentsService = new CommentsService();
    jest.clearAllMocks();
  });

  it('GIVEN user journey WHEN creating post, commenting, reacting THEN full flow works', async () => {
    // Step 1: User A creates a post
    const newPost = {
      id: 'journey-post-1',
      authorId: 'user-a',
      title: 'A minha receita secreta',
      body: 'Ingredientes: ...',
      category: 'recipes',
      status: 'active',
      createdAt: new Date(),
      group: null,
    };
    mockPrismaMethods.post.create.mockResolvedValue(newPost);

    const post = await postsService.createPost({
      authorId: 'user-a',
      title: 'A minha receita secreta',
      body: 'Ingredientes: ...',
      category: 'recipes',
    });
    expect(post.id).toBe('journey-post-1');

    // Step 2: User B comments on the post
    const newComment = {
      id: 'journey-comment-1',
      postId: 'journey-post-1',
      authorId: 'user-b',
      body: 'Fantástico! Vou experimentar.',
      status: 'active',
      createdAt: new Date(),
    };
    mockPrismaMethods.comment.create.mockResolvedValue(newComment);
    mockPrismaMethods.post.findUnique.mockResolvedValue({
      ...newPost,
      authorId: 'user-a',
    });

    const comment = await commentsService.createComment({
      postId: 'journey-post-1',
      authorId: 'user-b',
      body: 'Fantástico! Vou experimentar.',
    });
    expect(comment.body).toBe('Fantástico! Vou experimentar.');

    // Verify User A was notified of the comment
    expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        type: 'comment',
      })
    );

    // Step 3: User C reacts to the post
    mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);
    mockPrismaMethods.reaction.create.mockResolvedValue({ id: 'r1' });

    const reaction = await postsService.toggleReaction('user-c', 'journey-post-1', 'useful');
    expect(reaction.action).toBe('added');

    // Verify User A was notified of the reaction
    expect(mockNotificationsService.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        type: 'reaction',
      })
    );

    // Step 4: Verify notification count (2 notifications: 1 comment + 1 reaction)
    expect(mockNotificationsService.createNotification).toHaveBeenCalledTimes(2);
  });

  it('GIVEN post author WHEN self-interacting THEN no notifications sent', async () => {
    // User creates post and interacts with it themselves
    const selfPost = {
      id: 'self-post-1',
      authorId: 'user-self',
      title: 'Meu Post',
      body: 'Conteúdo',
      status: 'active',
    };

    // Self comment
    mockPrismaMethods.comment.create.mockResolvedValue({
      id: 'c1',
      postId: 'self-post-1',
      authorId: 'user-self',
      body: 'Meu comentário',
    });
    mockPrismaMethods.post.findUnique.mockResolvedValue(selfPost);

    await commentsService.createComment({
      postId: 'self-post-1',
      authorId: 'user-self', // Same as post author
      body: 'Meu comentário',
    });

    // Self reaction
    mockPrismaMethods.reaction.findUnique.mockResolvedValue(null);
    mockPrismaMethods.reaction.create.mockResolvedValue({ id: 'r1' });

    await postsService.toggleReaction('user-self', 'self-post-1', 'like');

    // No notifications should be sent for self-interactions
    expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
  });
});

describe('Edge Cases & Error Handling', () => {
  let postsService: PostsService;
  let commentsService: CommentsService;

  beforeEach(() => {
    postsService = new PostsService();
    commentsService = new CommentsService();
    jest.clearAllMocks();
  });

  it('GIVEN non-existent post WHEN getPostById THEN returns null', async () => {
    mockPrismaMethods.post.findUnique.mockResolvedValue(null);

    const result = await postsService.getPostById('non-existent');

    expect(result).toBeNull();
  });

  it('GIVEN empty feed WHEN getAllPosts THEN returns empty array with metadata', async () => {
    mockPrismaMethods.post.findMany.mockResolvedValue([]);
    mockPrismaMethods.post.count.mockResolvedValue(0);
    mockPrismaMethods.profile.findMany.mockResolvedValue([]);

    const result = await postsService.getAllPosts();

    expect(result.posts).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
  });

  it('GIVEN post with no reactions WHEN getPostReactions THEN returns empty object', async () => {
    mockPrismaMethods.reaction.groupBy.mockResolvedValue([]);

    const result = await postsService.getPostReactions('post-1');

    expect(result).toEqual({});
  });

  it('GIVEN post author not found WHEN getAllPosts THEN post has null author', async () => {
    mockPrismaMethods.post.findMany.mockResolvedValue([{
      id: 'p1',
      authorId: 'deleted-user',
      title: 'Orphan Post',
      status: 'active',
      _count: { comments: 0 },
    }]);
    mockPrismaMethods.post.count.mockResolvedValue(1);
    mockPrismaMethods.profile.findMany.mockResolvedValue([]); // No authors found
    mockPrismaMethods.reaction.groupBy.mockResolvedValue([]);

    const result = await postsService.getAllPosts();

    expect(result.posts[0].author).toBeNull();
  });
});
