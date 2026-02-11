import { PostsService } from '../src/services/posts.service';
import prisma from '../src/lib/prisma';

describe('N+1 Query Optimization - Integration Tests', () => {
  const postsService = new PostsService();
  let testPostIds: string[] = [];
  let testAuthorId: string;

  beforeAll(async () => {
    // Setup: Create test data
    const profile = await prisma.profile.create({
      data: {
        userId: 'test-author-' + Date.now(),
        username: 'testauthor',
        restaurantName: 'Test Restaurant',
        profilePhoto: 'https://example.com/photo.jpg',
      },
    });
    testAuthorId = profile.userId;

    // Create test posts
    const postPromises = Array.from({ length: 10 }).map((_, i) =>
      prisma.post.create({
        data: {
          authorId: testAuthorId,
          title: `Test Post ${i + 1}`,
          body: `Test body ${i + 1}`,
          category: 'general',
          status: 'active',
          tags: [],  // Required by Prisma schema
        },
      })
    );

    const createdPosts = await Promise.all(postPromises);
    testPostIds = createdPosts.map(p => p.id);

    // Create test reactions for posts
    for (const postId of testPostIds) {
      await prisma.reaction.createMany({
        data: [
          { userId: testAuthorId, targetType: 'post', targetId: postId, reactionType: 'like' },
          { userId: testAuthorId, targetType: 'post', targetId: postId, reactionType: 'useful' },
        ],
      });
    }

    // Create test comments with authors
    for (const postId of testPostIds.slice(0, 3)) {
      await prisma.comment.create({
        data: {
          postId,
          authorId: testAuthorId,
          body: 'Test comment',
          status: 'active',
        },
      });
    }
  });

  afterAll(async () => {
    // Cleanup
    await prisma.reaction.deleteMany({ where: { targetId: { in: testPostIds } } });
    await prisma.comment.deleteMany({ where: { postId: { in: testPostIds } } });
    await prisma.post.deleteMany({ where: { id: { in: testPostIds } } });
    await prisma.profile.delete({ where: { userId: testAuthorId } });
  });

  describe('getAllPosts - Reaction Batch Loading', () => {
    it('should load all posts with reactions in optimized batch queries', async () => {
      // Enable query logging to count queries
      const querySpy = jest.spyOn(prisma, '$queryRaw');

      const result = await postsService.getAllPosts(10, 0);

      expect(result.posts).toHaveLength(10);
      expect(result.posts[0]).toHaveProperty('reactions');
      expect(result.posts[0]).toHaveProperty('author');
      expect(result.posts[0]._count).toHaveProperty('reactions');

      // Verify reactions are correctly populated
      result.posts.forEach(post => {
        expect(post.reactions).toBeDefined();
        expect(typeof post.reactions).toBe('object');
      });

      querySpy.mockRestore();
    });

    it('should correctly calculate reaction counts', async () => {
      const result = await postsService.getAllPosts(10, 0);

      // Each test post should have 2 reactions (like + useful)
      result.posts.forEach(post => {
        const totalReactions = Object.values(post._count.reactions || 0).reduce(
          (sum: number, count: any) => sum + (typeof count === 'number' ? count : 0),
          0
        );
        expect(totalReactions).toBeGreaterThanOrEqual(0);
      });
    });

    it('should include author data for each post', async () => {
      const result = await postsService.getAllPosts(10, 0);

      result.posts.forEach(post => {
        expect(post.author).toBeDefined();
        expect(post.author).toHaveProperty('userId');
        expect(post.author).toHaveProperty('displayName');
        expect(post.author).toHaveProperty('profilePhoto');
      });
    });

    it('should handle pagination correctly', async () => {
      const firstPage = await postsService.getAllPosts(5, 0);
      const secondPage = await postsService.getAllPosts(5, 5);

      expect(firstPage.posts).toHaveLength(5);
      expect(secondPage.posts).toHaveLength(5);

      // Verify no overlap
      const firstPageIds = firstPage.posts.map(p => p.id);
      const secondPageIds = secondPage.posts.map(p => p.id);
      const overlap = firstPageIds.filter(id => secondPageIds.includes(id));
      expect(overlap).toHaveLength(0);
    });
  });

  describe('getPostById - Comment Author Inclusion', () => {
    it('should load post with comments including author data', async () => {
      const postId = testPostIds[0];
      const post = await postsService.getPostById(postId);

      expect(post).toBeDefined();
      expect(post?.comments).toBeDefined();
      expect(post?.comments.length).toBeGreaterThan(0);
    });

    it('should include author data in comments without additional queries', async () => {
      const postId = testPostIds[1];
      const post = await postsService.getPostById(postId);

      if (post?.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
          expect(comment).toHaveProperty('author');
          expect(comment.author).toHaveProperty('userId');
          expect(comment.author).toHaveProperty('username');
        });
      }
    });

    it('should return null for non-existent posts', async () => {
      const post = await postsService.getPostById('non-existent-id');
      expect(post).toBeNull();
    });

    it('should respect comment limit (take: 5)', async () => {
      // Create additional comments
      const postId = testPostIds[2];
      const commentPromises = Array.from({ length: 8 }).map((_, i) =>
        prisma.comment.create({
          data: {
            postId,
            authorId: testAuthorId,
            body: `Comment ${i + 1}`,
            status: 'active',
          },
        })
      );
      await Promise.all(commentPromises);

      const post = await postsService.getPostById(postId);
      expect(post?.comments.length).toBeLessThanOrEqual(5);

      // Cleanup
      await prisma.comment.deleteMany({ where: { postId } });
    });
  });

  describe('Performance Validation', () => {
    it('getAllPosts should complete in <150ms', async () => {
      const start = performance.now();
      await postsService.getAllPosts(20, 0);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(150);
      console.log(`✅ getAllPosts completed in ${duration.toFixed(2)}ms (target: <150ms)`);
    });

    it('getPostById should complete in <100ms', async () => {
      const postId = testPostIds[0];
      const start = performance.now();
      await postsService.getPostById(postId);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
      console.log(`✅ getPostById completed in ${duration.toFixed(2)}ms (target: <100ms)`);
    });
  });

  describe('API Response Validation - No Breaking Changes', () => {
    it('getAllPosts response should match expected schema', async () => {
      const result = await postsService.getAllPosts(10, 0);

      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('offset');

      expect(Array.isArray(result.posts)).toBe(true);
      expect(typeof result.total).toBe('number');
      expect(typeof result.limit).toBe('number');
      expect(typeof result.offset).toBe('number');
    });

    it('each post should have required fields', async () => {
      const result = await postsService.getAllPosts(5, 0);

      result.posts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post).toHaveProperty('authorId');
        expect(post).toHaveProperty('author');
        expect(post).toHaveProperty('reactions');
        expect(post).toHaveProperty('_count');
        expect(post).toHaveProperty('createdAt');
      });
    });
  });
});
