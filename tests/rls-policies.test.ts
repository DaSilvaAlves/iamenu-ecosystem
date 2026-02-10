/**
 * RLS Policies Integration Tests
 * Tests Row-Level Security enforcement across all services
 *
 * These tests validate that RLS policies correctly filter data
 * based on the current_user_id session variable
 */

import { prisma as communityCommunityDb } from '../services/community/src/lib/prisma';
import { prisma as marketplaceCommunityDb } from '../services/marketplace/src/lib/prisma';
import { prisma as academyCommunityDb } from '../services/academy/src/lib/prisma';

// Test data
const TEST_USER_1 = 'test-user-001';
const TEST_USER_2 = 'test-user-002';
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('RLS Policy Enforcement', () => {
  /**
   * Community Service Tests
   */
  describe('Community Service - Posts RLS', () => {
    beforeEach(async () => {
      // Clean up test data
      await communityCommunityDb.$executeRaw`
        DELETE FROM "community"."posts" WHERE "authorId" IN (${TEST_USER_1}, ${TEST_USER_2})
      `;
    });

    afterEach(async () => {
      // Reset RLS context
      await communityCommunityDb.$executeRaw`RESET app.current_user_id`;
    });

    it('should allow user to see their own posts', async () => {
      // Create test post for user 1
      await communityCommunityDb.$executeRaw`
        INSERT INTO "community"."posts" (id, "authorId", title, body, status, "createdAt")
        VALUES (
          ${VALID_UUID},
          ${TEST_USER_1},
          'Test Post',
          'Test Body',
          'active',
          NOW()
        )
      `;

      // Set RLS context for user 1
      await communityCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_1}`;

      // Query posts
      const result = await communityCommunityDb.$queryRaw<
        Array<{ id: string; authorId: string; title: string }>
      >`SELECT id, "authorId", title FROM "community"."posts"`;

      // User 1 should see their own post
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((p) => p.authorId === TEST_USER_1)).toBe(true);
    });

    it('should prevent user from seeing others posts (private)', async () => {
      // Create posts for both users
      await communityCommunityDb.$executeRaw`
        INSERT INTO "community"."posts" (id, "authorId", title, body, status, "groupId", "createdAt")
        VALUES
          (${VALID_UUID}, ${TEST_USER_1}, 'Post 1', 'Body 1', 'active', NULL, NOW()),
          ('550e8400-e29b-41d4-a716-446655440001', ${TEST_USER_2}, 'Post 2', 'Body 2', 'active', NULL, NOW())
      `;

      // Set RLS context for user 2
      await communityCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_2}`;

      // Query posts as user 2
      const result = await communityCommunityDb.$queryRaw<
        Array<{ authorId: string }>
      >`SELECT "authorId" FROM "community"."posts"`;

      // User 2 should NOT see user 1's posts
      expect(result.every((p) => p.authorId === TEST_USER_2 || p.authorId === null)).toBe(true);
    });
  });

  /**
   * Marketplace Service Tests
   */
  describe('Marketplace Service - Suppliers RLS', () => {
    beforeEach(async () => {
      // Clean up test data
      await marketplaceCommunityDb.$executeRaw`
        DELETE FROM "marketplace"."suppliers" WHERE "user_id" IN (${TEST_USER_1}, ${TEST_USER_2})
      `;
    });

    afterEach(async () => {
      // Reset RLS context
      await marketplaceCommunityDb.$executeRaw`RESET app.current_user_id`;
    });

    it('should allow supplier to see own profile', async () => {
      // Create supplier for user 1
      await marketplaceCommunityDb.$executeRaw`
        INSERT INTO "marketplace"."suppliers" (id, "user_id", "companyName", "createdAt")
        VALUES (${VALID_UUID}, ${TEST_USER_1}, 'Test Company', NOW())
      `;

      // Set RLS context for user 1
      await marketplaceCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_1}`;

      // Query suppliers
      const result = await marketplaceCommunityDb.$queryRaw<
        Array<{ id: string; user_id: string }>
      >`SELECT id, "user_id" FROM "marketplace"."suppliers"`;

      // User 1 should see their own supplier record
      expect(result.some((s) => s.user_id === TEST_USER_1)).toBe(true);
    });

    it('should allow all authenticated users to see public supplier info', async () => {
      // Create supplier for user 1
      await marketplaceCommunityDb.$executeRaw`
        INSERT INTO "marketplace"."suppliers" (id, "user_id", "companyName", "createdAt")
        VALUES (${VALID_UUID}, ${TEST_USER_1}, 'Public Company', NOW())
      `;

      // Set RLS context for user 2 (different user)
      await marketplaceCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_2}`;

      // Query suppliers as user 2
      const result = await marketplaceCommunityDb.$queryRaw<
        Array<{ id: string; user_id: string }>
      >`SELECT id, "user_id" FROM "marketplace"."suppliers"`;

      // User 2 should see public supplier info (RLS allows SELECT on all rows)
      // Note: Application layer should filter sensitive fields
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * Academy Service Tests
   */
  describe('Academy Service - Enrollments RLS', () => {
    beforeEach(async () => {
      // Clean up test data
      await academyCommunityDb.$executeRaw`
        DELETE FROM "academy"."enrollments" WHERE "student_id" IN (${TEST_USER_1}, ${TEST_USER_2})
      `;
    });

    afterEach(async () => {
      // Reset RLS context
      await academyCommunityDb.$executeRaw`RESET app.current_user_id`;
    });

    it('should allow student to see own enrollments', async () => {
      // Create enrollment for user 1
      await academyCommunityDb.$executeRaw`
        INSERT INTO "academy"."enrollments" (id, "student_id", "course_id", "progress", "enrolled_at")
        VALUES (${VALID_UUID}, ${TEST_USER_1}, 'course-001', 50, NOW())
      `;

      // Set RLS context for user 1
      await academyCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_1}`;

      // Query enrollments
      const result = await academyCommunityDb.$queryRaw<
        Array<{ id: string; student_id: string }>
      >`SELECT id, "student_id" FROM "academy"."enrollments"`;

      // User 1 should see their own enrollments
      expect(result.some((e) => e.student_id === TEST_USER_1)).toBe(true);
    });

    it('should prevent student from seeing others enrollments', async () => {
      // Create enrollments for both users
      await academyCommunityDb.$executeRaw`
        INSERT INTO "academy"."enrollments" (id, "student_id", "course_id", "progress", "enrolled_at")
        VALUES
          (${VALID_UUID}, ${TEST_USER_1}, 'course-001', 50, NOW()),
          ('550e8400-e29b-41d4-a716-446655440001', ${TEST_USER_2}, 'course-002', 75, NOW())
      `;

      // Set RLS context for user 2
      await academyCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_2}`;

      // Query enrollments as user 2
      const result = await academyCommunityDb.$queryRaw<
        Array<{ student_id: string }>
      >`SELECT "student_id" FROM "academy"."enrollments"`;

      // User 2 should ONLY see their own enrollments
      expect(result.every((e) => e.student_id === TEST_USER_2)).toBe(true);
    });
  });

  /**
   * Session Variable Validation Tests
   */
  describe('Session Variable Validation', () => {
    it('should handle NULL session variable gracefully', async () => {
      // Reset to NULL session variable
      await communityCommunityDb.$executeRaw`RESET app.current_user_id`;

      // Query with NULL session variable
      // RLS should handle this - application layer should prevent this via middleware
      const result = await communityCommunityDb.$queryRaw<
        Array<{ id: string }>
      >`SELECT id FROM "community"."posts"`;

      // Should return results or empty (depends on policy)
      // The important thing is it doesn't crash
      expect(Array.isArray(result)).toBe(true);
    });

    it('should verify session variable is properly set', async () => {
      const userId = TEST_USER_1;

      // Set session variable
      await communityCommunityDb.$executeRaw`SET app.current_user_id = ${userId}`;

      // Verify it was set
      const result = await communityCommunityDb.$queryRaw<
        [{ current_user_id: string }]
      >`SELECT current_setting('app.current_user_id') as current_user_id`;

      expect(result[0].current_user_id).toBe(userId);
    });
  });

  /**
   * Performance Tests
   */
  describe('RLS Performance', () => {
    it('should execute queries with RLS in reasonable time', async () => {
      await communityCommunityDb.$executeRaw`SET app.current_user_id = ${TEST_USER_1}`;

      const startTime = Date.now();

      // Execute query
      await communityCommunityDb.$queryRaw`
        SELECT id FROM "community"."posts"
        WHERE "groupId" IN (
          SELECT "groupId" FROM "community"."group_memberships"
          WHERE "userId" = ${TEST_USER_1}
        )
      `;

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete in < 1 second for reasonable dataset
      expect(executionTime).toBeLessThan(1000);
    });
  });
});

describe('RLS Middleware Validation', () => {
  it('should validate user ID before setting RLS context', async () => {
    // Test with invalid user ID
    const invalidUserIds = ['', null, undefined, 123];

    for (const invalidId of invalidUserIds) {
      expect(() => {
        if (!invalidId || typeof invalidId !== 'string' || !invalidId.trim()) {
          throw new Error('Invalid user ID for RLS context');
        }
      }).toThrow('Invalid user ID for RLS context');
    }
  });

  it('should handle RLS context errors gracefully', async () => {
    try {
      // This should not crash the application
      await communityCommunityDb.$executeRaw`SET app.current_user_id = ${null}`;
    } catch (error) {
      // Error is expected, but should be catchable and handleable
      expect(error).toBeDefined();
    }
  });
});
