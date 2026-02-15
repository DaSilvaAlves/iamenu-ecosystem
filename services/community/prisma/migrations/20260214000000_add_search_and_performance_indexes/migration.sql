-- Migration: Add Full-Text Search & Performance Optimization Indexes
-- Story 3.5 (Full-Text Search) & Story 3.2 (Query Optimization)
-- Date: 2026-02-14

-- ============================================
-- FULL-TEXT SEARCH INDEXES (GIN)
-- For Story 3.5: Full-Text Search Implementation
-- ============================================

-- Posts: Full-text search on title + content
CREATE INDEX IF NOT EXISTS idx_posts_search_gin
  ON "community"."Post" USING GIN(to_tsvector('portuguese', "title" || ' ' || COALESCE("content", '')));

-- Comments: Full-text search on content
CREATE INDEX IF NOT EXISTS idx_comments_search_gin
  ON "community"."Comment" USING GIN(to_tsvector('portuguese', COALESCE("content", '')));

-- ============================================
-- FOREIGN KEY INDEXES (Performance)
-- For Story 3.2: Query Optimization - N+1 pattern fixes
-- ============================================

-- Posts: Author lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON "community"."Post"("authorId");

-- Comments: Post lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON "community"."Comment"("postId");

-- Comments: Author lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON "community"."Comment"("authorId");

-- Followers: User lookup
CREATE INDEX IF NOT EXISTS idx_followers_user_id ON "community"."Follower"("userId");

-- Followers: Following lookup
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON "community"."Follower"("followingId");

-- Reactions: Post lookup
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON "community"."Reaction"("postId");

-- Reactions: User lookup
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON "community"."Reaction"("userId");

-- ============================================
-- FILTER COLUMN INDEXES (Performance)
-- Optimize sorting and filtering operations
-- ============================================

-- Posts: Created timestamp (sorting)
CREATE INDEX IF NOT EXISTS idx_posts_created_at_desc ON "community"."Post"("createdAt" DESC);

-- Posts: Status filter
CREATE INDEX IF NOT EXISTS idx_posts_status ON "community"."Post"("status");

-- Posts: Deleted at (soft deletes)
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON "community"."Post"("deletedAt") WHERE "deletedAt" IS NULL;

-- Comments: Created timestamp
CREATE INDEX IF NOT EXISTS idx_comments_created_at_desc ON "community"."Comment"("createdAt" DESC);

-- Comments: Deleted at (soft deletes)
CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON "community"."Comment"("deletedAt") WHERE "deletedAt" IS NULL;

-- ============================================
-- COMPOSITE INDEXES (Complex queries)
-- ============================================

-- Posts: Author + Created (common query pattern)
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON "community"."Post"("authorId", "createdAt" DESC);

-- Comments: Post + Created (thread queries)
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON "community"."Comment"("postId", "createdAt" DESC);

-- ============================================
-- PERFORMANCE NOTES
-- ============================================
--
-- Expected improvements:
-- - Full-text search: < 200ms for 10k items (Story 3.5)
-- - N+1 queries: 60% reduction with FK indexes (Story 3.2)
-- - Sort operations: 40% faster with created_at indexes
--
-- Index maintenance:
-- - GIN indexes have higher write cost but excellent read performance
-- - VACUUM ANALYZE should run regularly for accuracy
-- - Monitor index bloat: SELECT * FROM pg_stat_user_indexes
--
