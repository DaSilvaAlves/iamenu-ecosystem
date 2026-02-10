-- RLS Policies for Community Schema
-- Task 1.1.2: Row-Level Security Implementation
-- Uses PostgreSQL session variables: SET app.current_user_id = 'user-id';

-- ============================================
-- 1. ENABLE RLS on posts table
-- ============================================
ALTER TABLE "community"."posts" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: User sees own posts
CREATE POLICY "posts_user_owns_policy" ON "community"."posts"
  FOR ALL
  USING ("authorId" = current_setting('app.current_user_id'));

-- Policy 1b: User sees posts from groups they're in
CREATE POLICY "posts_group_access_policy" ON "community"."posts"
  FOR SELECT
  USING (
    "groupId" IS NULL OR
    "groupId" IN (
      SELECT "groupId" FROM "community"."group_memberships"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );


-- ============================================
-- 2. ENABLE RLS on comments table
-- ============================================
ALTER TABLE "community"."comments" ENABLE ROW LEVEL SECURITY;

-- Policy 2a: User sees own comments
CREATE POLICY "comments_user_owns_policy" ON "community"."comments"
  FOR ALL
  USING ("authorId" = current_setting('app.current_user_id'));

-- Policy 2b: User sees comments on posts they can see
CREATE POLICY "comments_post_visible_policy" ON "community"."comments"
  FOR SELECT
  USING (
    "postId" IN (
      SELECT id FROM "community"."posts"
      WHERE "authorId" = current_setting('app.current_user_id')
      OR "groupId" IN (
        SELECT "groupId" FROM "community"."group_memberships"
        WHERE "userId" = current_setting('app.current_user_id')
      )
      OR "groupId" IS NULL
    )
  );


-- ============================================
-- 3. ENABLE RLS on profiles table
-- ============================================
-- Note: Profiles RLS deferred - schema doesn't have isPublicProfile column yet
-- Can be implemented once profile visibility field is added to schema
-- ALTER TABLE "community"."profiles" ENABLE ROW LEVEL SECURITY;


-- ============================================
-- Create indexes for RLS performance
-- ============================================
CREATE INDEX IF NOT EXISTS "posts_groupId_idx" ON "community"."posts"("groupId");
CREATE INDEX IF NOT EXISTS "comments_postId_idx" ON "community"."comments"("postId");
CREATE INDEX IF NOT EXISTS "group_memberships_userId_groupId_idx" ON "community"."group_memberships"("userId", "groupId");
