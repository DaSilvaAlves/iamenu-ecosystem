-- RLS Policies for Marketplace Schema
-- Task 1.1.2: Row-Level Security Implementation
-- Uses PostgreSQL session variables: SET app.current_user_id = 'user-id';

-- ============================================
-- 1. ENABLE RLS on quotes table
-- ============================================
ALTER TABLE "marketplace"."quotes" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: Supplier sees their own quotes
CREATE POLICY "quotes_supplier_owns_policy" ON "marketplace"."quotes"
  FOR ALL
  USING (
    "supplier_id" IN (
      SELECT id FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
  );

-- Policy 1b: Restaurant/Buyer sees quotes from their own requests
CREATE POLICY "quotes_buyer_sees_own_policy" ON "marketplace"."quotes"
  FOR SELECT
  USING (
    "quote_request_id" IN (
      SELECT id FROM "marketplace"."quote_requests"
      WHERE "restaurant_id" = current_setting('app.current_user_id')
    )
  );


-- ============================================
-- 2. ENABLE RLS on suppliers table
-- ============================================
ALTER TABLE "marketplace"."suppliers" ENABLE ROW LEVEL SECURITY;

-- Policy 2a: Supplier sees own full profile
CREATE POLICY "suppliers_user_owns_policy" ON "marketplace"."suppliers"
  FOR ALL
  USING ("user_id" = current_setting('app.current_user_id'));

-- Policy 2b: All authenticated users can see public supplier info
-- (Application layer should filter sensitive fields for non-owners)
CREATE POLICY "suppliers_public_policy" ON "marketplace"."suppliers"
  FOR SELECT
  USING (true);


-- ============================================
-- 3. Indexes for RLS performance
-- ============================================
CREATE INDEX IF NOT EXISTS "quotes_supplier_id_idx" ON "marketplace"."quotes"("supplier_id");
CREATE INDEX IF NOT EXISTS "quotes_quote_request_id_idx" ON "marketplace"."quotes"("quote_request_id");
CREATE INDEX IF NOT EXISTS "suppliers_user_id_idx" ON "marketplace"."suppliers"("user_id");
CREATE INDEX IF NOT EXISTS "quote_requests_restaurant_id_idx" ON "marketplace"."quote_requests"("restaurant_id");
