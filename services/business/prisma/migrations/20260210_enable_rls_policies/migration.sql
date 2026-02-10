-- Sprint 2 Phase E: Enable RLS and Create 4 CRITICAL Policies for Business Service

-- ============================================
-- 1. RESTAURANTS TABLE - STRICT ISOLATION
-- ============================================

ALTER TABLE "business"."restaurants" ENABLE ROW LEVEL SECURITY;

-- Policy 1: CRITICAL - Owner sees ONLY own restaurant
CREATE POLICY "restaurants_strict_isolation" ON "business"."restaurants"
  FOR ALL
  USING (
    "userId" = current_setting('app.current_user_id')
  );

-- ============================================
-- 2. RESTAURANT_SETTINGS TABLE - STRICT
-- ============================================

ALTER TABLE "business"."restaurant_settings" ENABLE ROW LEVEL SECURITY;

-- Policy 2: Settings attached to restaurant, so restrict via restaurant access
CREATE POLICY "restaurant_settings_strict" ON "business"."restaurant_settings"
  FOR ALL
  USING (
    "restaurantId" IN (
      SELECT "id" FROM "business"."restaurants"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );

-- ============================================
-- 3. PRODUCTS TABLE - STRICT
-- ============================================

ALTER TABLE "business"."products" ENABLE ROW LEVEL SECURITY;

-- Policy 3: Owner sees ONLY own restaurant products
CREATE POLICY "products_owner_only" ON "business"."products"
  FOR ALL
  USING (
    "restaurantId" IN (
      SELECT "id" FROM "business"."restaurants"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );

-- ============================================
-- 4. ORDERS TABLE - STRICT
-- ============================================

ALTER TABLE "business"."orders" ENABLE ROW LEVEL SECURITY;

-- Policy 4: Owner sees ONLY own restaurant orders
CREATE POLICY "orders_owner_only" ON "business"."orders"
  FOR ALL
  USING (
    "restaurantId" IN (
      SELECT "id" FROM "business"."restaurants"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );

-- ============================================
-- 5. ORDER_ITEMS TABLE - STRICT
-- ============================================

ALTER TABLE "business"."order_items" ENABLE ROW LEVEL SECURITY;

-- Policy 5: User sees items from their own orders
CREATE POLICY "order_items_owner_access" ON "business"."order_items"
  FOR ALL
  USING (
    "orderId" IN (
      SELECT "id" FROM "business"."orders"
      WHERE "restaurantId" IN (
        SELECT "id" FROM "business"."restaurants"
        WHERE "userId" = current_setting('app.current_user_id')
      )
    )
  );

-- ============================================
-- 6. DAILY_STATS TABLE - STRICT
-- ============================================

ALTER TABLE "business"."daily_stats" ENABLE ROW LEVEL SECURITY;

-- Policy 6: Owner sees ONLY own restaurant stats
CREATE POLICY "daily_stats_owner_only" ON "business"."daily_stats"
  FOR ALL
  USING (
    "restaurantId" IN (
      SELECT "id" FROM "business"."restaurants"
      WHERE "userId" = current_setting('app.current_user_id')
    )
  );
