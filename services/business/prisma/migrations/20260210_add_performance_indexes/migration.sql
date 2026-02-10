-- Sprint 1 Task 1.3: Add Performance Indexes for Business

-- Restaurant indexes
CREATE INDEX IF NOT EXISTS "restaurants_user_id_idx" ON "business"."restaurants"("userId");

-- Order indexes
CREATE INDEX IF NOT EXISTS "orders_restaurant_id_idx" ON "business"."orders"("restaurantId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "business"."orders"("status");
CREATE INDEX IF NOT EXISTS "orders_restaurant_id_order_date_idx" ON "business"."orders"("restaurantId", "orderDate" DESC);

-- Product indexes
CREATE INDEX IF NOT EXISTS "products_restaurant_id_idx" ON "business"."products"("restaurantId");

-- DailyStats indexes
CREATE INDEX IF NOT EXISTS "daily_stats_restaurant_id_idx" ON "business"."daily_stats"("restaurantId");
CREATE INDEX IF NOT EXISTS "daily_stats_date_desc_idx" ON "business"."daily_stats"("date" DESC);
