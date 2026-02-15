-- Migration: Add Full-Text Search & Performance Optimization Indexes (Business)
-- Story 3.5 (Full-Text Search) & Story 3.2 (Query Optimization)
-- Date: 2026-02-14

-- ============================================
-- FULL-TEXT SEARCH INDEXES (GIN)
-- For Story 3.5: Full-Text Search Implementation
-- ============================================

-- Products: Full-text search on name + description
CREATE INDEX IF NOT EXISTS idx_products_search_gin
  ON "business"."Product" USING GIN(to_tsvector('portuguese', "name" || ' ' || COALESCE("description", '')));

-- ============================================
-- FOREIGN KEY INDEXES (Performance)
-- For Story 3.2: Query Optimization - N+1 pattern fixes
-- ============================================

-- Products: Restaurant lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_products_restaurant_id ON "business"."Product"("restaurantId");

-- OrderItems: Order lookup
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "business"."OrderItem"("orderId");

-- OrderItems: Product lookup
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON "business"."OrderItem"("productId");

-- Orders: Restaurant lookup
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON "business"."Order"("restaurantId");

-- DailyStats: Restaurant lookup
CREATE INDEX IF NOT EXISTS idx_daily_stats_restaurant_id ON "business"."DailyStats"("restaurantId");

-- ============================================
-- FILTER COLUMN INDEXES (Performance)
-- Optimize sorting and filtering operations
-- ============================================

-- Orders: Status filter
CREATE INDEX IF NOT EXISTS idx_orders_status ON "business"."Order"("status");

-- Orders: Created timestamp
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON "business"."Order"("createdAt" DESC);

-- DailyStats: Date filter (analytics queries)
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON "business"."DailyStats"("date" DESC);

-- DailyStats: Restaurant + Date (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_daily_stats_restaurant_date ON "business"."DailyStats"("restaurantId", "date" DESC);

-- ============================================
-- COMPOSITE INDEXES (Complex queries)
-- ============================================

-- Orders: Restaurant + Status (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON "business"."Order"("restaurantId", "status");

-- Orders: Restaurant + Created (timeline queries)
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created ON "business"."Order"("restaurantId", "createdAt" DESC);
