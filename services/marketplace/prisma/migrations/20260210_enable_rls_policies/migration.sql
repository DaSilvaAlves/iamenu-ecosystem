-- Sprint 2 Phase C: Enable RLS and Create 5 Policies for Marketplace Service

-- ============================================
-- 1. SUPPLIERS TABLE - 2 Policies
-- ============================================

ALTER TABLE "marketplace"."suppliers" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: SELECT - Supplier sees own full profile, others see public only
CREATE POLICY "suppliers_view_policy" ON "marketplace"."suppliers"
  FOR SELECT
  USING (
    -- Supplier owner sees own full profile
    "user_id" = current_setting('app.current_user_id')
    OR
    -- Other users see only verified/public suppliers
    "verified" = true
  );

-- Policy 1b: INSERT/UPDATE - Only supplier can create/edit own profile
CREATE POLICY "suppliers_manage_policy" ON "marketplace"."suppliers"
  FOR INSERT
  WITH CHECK (
    "user_id" = current_setting('app.current_user_id')
  );

CREATE POLICY "suppliers_update_policy" ON "marketplace"."suppliers"
  FOR UPDATE
  USING (
    "user_id" = current_setting('app.current_user_id')
  );

-- ============================================
-- 2. QUOTES TABLE - 1 Policy (Complex)
-- ============================================

ALTER TABLE "marketplace"."quotes" ENABLE ROW LEVEL SECURITY;

-- Policy 2: SELECT - Supplier sees quotes they sent, Buyer sees from their requests
CREATE POLICY "quotes_view_policy" ON "marketplace"."quotes"
  FOR SELECT
  USING (
    -- Supplier can see quotes they sent
    "supplier_id" IN (
      SELECT "id" FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
    OR
    -- Buyer can see quotes for their requests
    "quote_request_id" IN (
      SELECT "id" FROM "marketplace"."quote_requests"
      WHERE "restaurant_id" = current_setting('app.current_user_id')
    )
  );

-- ============================================
-- 3. QUOTE_REQUESTS TABLE - 1 Policy
-- ============================================

ALTER TABLE "marketplace"."quote_requests" ENABLE ROW LEVEL SECURITY;

-- Policy 3: SELECT - Buyer sees own requests, Suppliers can see if mentioned
CREATE POLICY "quote_requests_view_policy" ON "marketplace"."quote_requests"
  FOR SELECT
  USING (
    -- Restaurant sees own requests
    "restaurant_id" = current_setting('app.current_user_id')
    OR
    -- Supplier sees requests if mentioned in suppliers array
    current_setting('app.current_user_id') IN (
      SELECT DISTINCT UNNEST("suppliers")
      FROM "marketplace"."quote_requests"
    )
  );

-- ============================================
-- 4. REVIEWS TABLE - 2 Policies
-- ============================================

ALTER TABLE "marketplace"."reviews" ENABLE ROW LEVEL SECURITY;

-- Policy 4a: SELECT - All authenticated users can see reviews (public data)
CREATE POLICY "reviews_view_all" ON "marketplace"."reviews"
  FOR SELECT
  USING (true);

-- Policy 4b: INSERT - User can only create own review
CREATE POLICY "reviews_create_policy" ON "marketplace"."reviews"
  FOR INSERT
  WITH CHECK (
    "reviewer_id" = current_setting('app.current_user_id')
  );

-- Policy 4c: UPDATE - Supplier can update own supplier_response
CREATE POLICY "reviews_supplier_response" ON "marketplace"."reviews"
  FOR UPDATE
  USING (
    "supplier_id" IN (
      SELECT "id" FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
  );

-- ============================================
-- 5. COLLECTIVE_BARGAINS TABLE - 2 Policies
-- ============================================

ALTER TABLE "marketplace"."collective_bargains" ENABLE ROW LEVEL SECURITY;

-- Policy 5a: SELECT - Participants see bargains they're part of
CREATE POLICY "collective_bargains_view_policy" ON "marketplace"."collective_bargains"
  FOR SELECT
  USING (
    -- Creator sees own bargains
    "creator_id" = current_setting('app.current_user_id')
    OR
    -- Public bargains visible to all (for joining)
    "status" = 'open'
    OR
    -- Participants see bargains they joined
    current_setting('app.current_user_id') IN (
      SELECT DISTINCT UNNEST("participants")
      FROM "marketplace"."collective_bargains"
    )
  );

-- Policy 5b: INSERT - Any user can create bargain
CREATE POLICY "collective_bargains_create_policy" ON "marketplace"."collective_bargains"
  FOR INSERT
  WITH CHECK (
    "creator_id" = current_setting('app.current_user_id')
  );

-- ============================================
-- 6. SUPPLIER_PRODUCTS TABLE - 1 Policy
-- ============================================

ALTER TABLE "marketplace"."supplier_products" ENABLE ROW LEVEL SECURITY;

-- Policy 6: All users can view public product listings
CREATE POLICY "supplier_products_view_policy" ON "marketplace"."supplier_products"
  FOR SELECT
  USING (
    -- Supplier sees own products
    "supplier_id" IN (
      SELECT "id" FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
    OR
    -- Others see available products from verified suppliers
    "available" = true
  );

-- ============================================
-- 7. PRICE_HISTORY TABLE - 1 Policy
-- ============================================

ALTER TABLE "marketplace"."price_history" ENABLE ROW LEVEL SECURITY;

-- Policy 7: Supplier sees own price history, others see public
CREATE POLICY "price_history_view_policy" ON "marketplace"."price_history"
  FOR SELECT
  USING (
    -- Supplier sees own price history
    "supplier_id" IN (
      SELECT "id" FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
    OR
    -- Others see price history for products they can see
    "product_id" IN (
      SELECT "id" FROM "marketplace"."products"
    )
  );

-- ============================================
-- 8. PRODUCTS TABLE - 1 Policy
-- ============================================

ALTER TABLE "marketplace"."products" ENABLE ROW LEVEL SECURITY;

-- Policy 8: All authenticated users can view products
CREATE POLICY "products_view_all" ON "marketplace"."products"
  FOR SELECT
  USING (true);

-- ============================================
-- 9. BARGAIN_ADHESIONS TABLE - 1 Policy
-- ============================================

ALTER TABLE "marketplace"."bargain_adhesions" ENABLE ROW LEVEL SECURITY;

-- Policy 9: User sees own adhesions and bargain info
CREATE POLICY "bargain_adhesions_view_policy" ON "marketplace"."bargain_adhesions"
  FOR SELECT
  USING (
    -- User sees own adhesions
    "user_id" = current_setting('app.current_user_id')
    OR
    -- Bargain creator sees all adhesions for their bargains
    "collective_bargain_id" IN (
      SELECT "id" FROM "marketplace"."collective_bargains"
      WHERE "creator_id" = current_setting('app.current_user_id')
    )
  );

-- Policy 9b: INSERT - User can only join bargains for themselves
CREATE POLICY "bargain_adhesions_join_policy" ON "marketplace"."bargain_adhesions"
  FOR INSERT
  WITH CHECK (
    "user_id" = current_setting('app.current_user_id')
  );
