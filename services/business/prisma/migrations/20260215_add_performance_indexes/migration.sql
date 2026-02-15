-- Performance Optimization: Add indexes for Business service

-- Foreign keys
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON business.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON business.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_restaurant_id ON business.daily_stats(restaurant_id);

-- Frequently filtered
CREATE INDEX IF NOT EXISTS idx_orders_status ON business.orders(status);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON business.daily_stats(date DESC);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status_created ON business.orders(restaurant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_restaurant_date ON business.daily_stats(restaurant_id, date DESC);
