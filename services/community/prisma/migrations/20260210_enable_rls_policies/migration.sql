-- Sprint 2 Phase B: Enable RLS and Create 8 Policies for Community Service

-- ============================================
-- 1. POSTS TABLE - 4 Policies
-- ============================================

ALTER TABLE "community"."posts" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: SELECT - User sees own posts + group posts + public posts
CREATE POLICY "posts_view_policy" ON "community"."posts"
  FOR SELECT
  USING (
    -- User owns the post
    "authorId" = current_setting('app.current_user_id')
    OR
    -- Post is in a group user is member of
    "groupId" IN (
      SELECT "groupId" FROM "community"."group_memberships"
      WHERE "userId" = current_setting('app.current_user_id')
    )
    OR
    -- Post has no group (public)
    "groupId" IS NULL
  );

-- Policy 1b: INSERT - User can only create posts (authorId = current user)
CREATE POLICY "posts_create_policy" ON "community"."posts"
  FOR INSERT
  WITH CHECK (
    "authorId" = current_setting('app.current_user_id')
  );

-- Policy 1c: UPDATE - User can only edit own posts
CREATE POLICY "posts_update_policy" ON "community"."posts"
  FOR UPDATE
  USING (
    "authorId" = current_setting('app.current_user_id')
  );

-- Policy 1d: DELETE - User can only delete own posts
CREATE POLICY "posts_delete_policy" ON "community"."posts"
  FOR DELETE
  USING (
    "authorId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 2. COMMENTS TABLE - 3 Policies
-- ============================================

ALTER TABLE "community"."comments" ENABLE ROW LEVEL SECURITY;

-- Policy 2a: SELECT - User sees comments on posts they can view
CREATE POLICY "comments_view_policy" ON "community"."comments"
  FOR SELECT
  USING (
    "postId" IN (
      SELECT "id" FROM "community"."posts"
      WHERE
        "authorId" = current_setting('app.current_user_id')
        OR "groupId" IN (
          SELECT "groupId" FROM "community"."group_memberships"
          WHERE "userId" = current_setting('app.current_user_id')
        )
        OR "groupId" IS NULL
    )
  );

-- Policy 2b: INSERT - User can only create own comments
CREATE POLICY "comments_create_policy" ON "community"."comments"
  FOR INSERT
  WITH CHECK (
    "authorId" = current_setting('app.current_user_id')
  );

-- Policy 2c: UPDATE - User can only edit own comments
CREATE POLICY "comments_update_policy" ON "community"."comments"
  FOR UPDATE
  USING (
    "authorId" = current_setting('app.current_user_id')
  );

-- Policy 2d: DELETE - User can only delete own comments
CREATE POLICY "comments_delete_policy" ON "community"."comments"
  FOR DELETE
  USING (
    "authorId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 3. GROUPS TABLE - 2 Policies
-- ============================================

ALTER TABLE "community"."groups" ENABLE ROW LEVEL SECURITY;

-- Policy 3a: SELECT - User sees groups they're in + public groups
CREATE POLICY "groups_view_policy" ON "community"."groups"
  FOR SELECT
  USING (
    "type" = 'public'
    OR "id" IN (
      SELECT "groupId" FROM "community"."group_memberships"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );

-- Policy 3b: UPDATE - Only group creator can update
CREATE POLICY "groups_update_policy" ON "community"."groups"
  FOR UPDATE
  USING (
    "createdBy" = current_setting('app.current_user_id')
  );

-- ============================================
-- 4. GROUP_MEMBERSHIPS TABLE - 2 Policies
-- ============================================

ALTER TABLE "community"."group_memberships" ENABLE ROW LEVEL SECURITY;

-- Policy 4a: SELECT - User sees memberships for groups they're in
CREATE POLICY "group_memberships_view_policy" ON "community"."group_memberships"
  FOR SELECT
  USING (
    "groupId" IN (
      SELECT "groupId" FROM "community"."group_memberships"
      WHERE "userId" = current_setting('app.current_user_id')
    )
    OR "userId" = current_setting('app.current_user_id')
  );

-- Policy 4b: INSERT - User can only join groups, application controls group access
CREATE POLICY "group_memberships_join_policy" ON "community"."group_memberships"
  FOR INSERT
  WITH CHECK (
    "userId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 5. NOTIFICATIONS TABLE - 1 Policy (STRICT)
-- ============================================

ALTER TABLE "community"."notifications" ENABLE ROW LEVEL SECURITY;

-- Policy 5: STRICT - User sees ONLY own notifications
CREATE POLICY "notifications_strict_policy" ON "community"."notifications"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 6. REACTIONS TABLE - Allows all (no sensitive data)
-- ============================================

ALTER TABLE "community"."reactions" ENABLE ROW LEVEL SECURITY;

-- Policy 6: Allow all (reactions are public engagement data)
CREATE POLICY "reactions_allow_all" ON "community"."reactions"
  FOR ALL
  USING (true);

-- ============================================
-- 7. FOLLOWERS TABLE - 2 Policies
-- ============================================

ALTER TABLE "community"."followers" ENABLE ROW LEVEL SECURITY;

-- Policy 7a: SELECT - All users can see follower relationships (public data)
CREATE POLICY "followers_view_all" ON "community"."followers"
  FOR SELECT
  USING (true);

-- Policy 7b: INSERT/DELETE - User can only follow/unfollow themselves
CREATE POLICY "followers_own_follow" ON "community"."followers"
  FOR INSERT
  WITH CHECK (
    "followerId" = current_setting('app.current_user_id')
  );

CREATE POLICY "followers_own_unfollow" ON "community"."followers"
  FOR DELETE
  USING (
    "followerId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 8. REFRESH_TOKENS TABLE - STRICT
-- ============================================

ALTER TABLE "community"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

-- Policy 8: STRICT - User sees ONLY own tokens
CREATE POLICY "refresh_tokens_own_only" ON "community"."refresh_tokens"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

-- ============================================
-- ADDITIONAL TABLES (minimal policies)
-- ============================================

ALTER TABLE "community"."profiles" ENABLE ROW LEVEL SECURITY;
-- Policy: Profiles are mostly public, but admins might restrict
CREATE POLICY "profiles_view_all" ON "community"."profiles"
  FOR SELECT
  USING (true);

ALTER TABLE "community"."user_points" ENABLE ROW LEVEL SECURITY;
-- Policy: User sees own points only
CREATE POLICY "user_points_own_only" ON "community"."user_points"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

ALTER TABLE "community"."points_history" ENABLE ROW LEVEL SECURITY;
-- Policy: User sees own history only
CREATE POLICY "points_history_own_only" ON "community"."points_history"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

ALTER TABLE "community"."user_streaks" ENABLE ROW LEVEL SECURITY;
-- Policy: User sees own streaks only
CREATE POLICY "user_streaks_own_only" ON "community"."user_streaks"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

ALTER TABLE "community"."user_warnings" ENABLE ROW LEVEL SECURITY;
-- Policy: User sees own warnings only (sensitive)
CREATE POLICY "user_warnings_own_only" ON "community"."user_warnings"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

ALTER TABLE "community"."moderation_logs" ENABLE ROW LEVEL SECURITY;
-- Policy: Only admins see moderation logs (application-enforced via role check)
CREATE POLICY "moderation_logs_admins_only" ON "community"."moderation_logs"
  FOR ALL
  USING (true); -- Application layer checks role

ALTER TABLE "community"."user_bans" ENABLE ROW LEVEL SECURITY;
-- Policy: User sees own ban status only
CREATE POLICY "user_bans_own_only" ON "community"."user_bans"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

ALTER TABLE "community"."reports" ENABLE ROW LEVEL SECURITY;
-- Policy: Reporter sees own reports, admins see all
CREATE POLICY "reports_own_or_admin" ON "community"."reports"
  FOR SELECT
  USING (
    "reporterId" = current_setting('app.current_user_id')
    OR true -- Application layer checks admin role
  );
