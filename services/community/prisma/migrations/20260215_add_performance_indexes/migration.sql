-- Performance Optimization: Add indexes for frequently used queries

-- Foreign key indexes (N+1 query prevention)
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON community.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_group_id ON community.posts(group_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON community.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON community.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON community.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON community.followers(follower_id);

-- Frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_posts_status ON community.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON community.posts(category);
CREATE INDEX IF NOT EXISTS idx_comments_status ON community.comments(status);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON community.profiles(verified);

-- Search fields (text search optimization)
CREATE INDEX IF NOT EXISTS idx_posts_title ON community.posts(title);
CREATE INDEX IF NOT EXISTS idx_posts_search ON community.posts USING GIN(to_tsvector('portuguese', title || ' ' || body));

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_posts_group_status_created ON community.posts(group_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_status_created ON community.comments(post_id, status, created_at DESC);

-- Reaction queries optimization
CREATE INDEX IF NOT EXISTS idx_reactions_target ON community.reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON community.reactions(user_id, target_type);
