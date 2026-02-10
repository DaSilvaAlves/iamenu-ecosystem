-- RLS Policies for Marketplace Schema - FINAL
-- Task 1.1.2: Row-Level Security Implementation
-- NOTE: This migration uses IF NOT EXISTS to handle re-application after previous failed migration
-- Uses PostgreSQL session variables: SET app.current_user_id = 'user-id';

-- ============================================
-- 1. ENSURE RLS on quotes table
-- ============================================
ALTER TABLE "marketplace"."quotes" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: Supplier sees their own quotes (SKIP if already exists)
-- Note: PostgreSQL doesn't support CREATE POLICY IF NOT EXISTS, so we check first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'quotes' AND policyname = 'quotes_supplier_owns_policy'
  ) THEN
    CREATE POLICY "quotes_supplier_owns_policy" ON "marketplace"."quotes"
      FOR ALL
      USING (
        "supplier_id" IN (
          SELECT id FROM "marketplace"."suppliers"
          WHERE "user_id" = current_setting('app.current_user_id')
        )
      );
  END IF;
END $$;

-- Policy 1b: Restaurant/Buyer sees quotes from their own requests (SKIP if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'quotes' AND policyname = 'quotes_buyer_sees_own_policy'
  ) THEN
    CREATE POLICY "quotes_buyer_sees_own_policy" ON "marketplace"."quotes"
      FOR SELECT
      USING (
        "quote_request_id" IN (
          SELECT id FROM "marketplace"."quote_requests"
          WHERE "restaurant_id" = current_setting('app.current_user_id')
        )
      );
  END IF;
END $$;


-- ============================================
-- 2. ENSURE RLS on suppliers table
-- ============================================
ALTER TABLE "marketplace"."suppliers" ENABLE ROW LEVEL SECURITY;

-- Policy 2a: Supplier sees own full profile (SKIP if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'suppliers' AND policyname = 'suppliers_user_owns_policy'
  ) THEN
    CREATE POLICY "suppliers_user_owns_policy" ON "marketplace"."suppliers"
      FOR ALL
      USING ("user_id" = current_setting('app.current_user_id'));
  END IF;
END $$;

-- Policy 2b: All authenticated users can see public supplier info (SKIP if already exists)
-- (Application layer should filter sensitive fields for non-owners)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'suppliers' AND policyname = 'suppliers_public_policy'
  ) THEN
    CREATE POLICY "suppliers_public_policy" ON "marketplace"."suppliers"
      FOR SELECT
      USING (true);
  END IF;
END $$;


-- ============================================
-- 3. Indexes for RLS performance (idempotent)
-- ============================================
CREATE INDEX IF NOT EXISTS "quotes_supplier_id_idx" ON "marketplace"."quotes"("supplier_id");
CREATE INDEX IF NOT EXISTS "quotes_quote_request_id_idx" ON "marketplace"."quotes"("quote_request_id");
CREATE INDEX IF NOT EXISTS "suppliers_user_id_idx" ON "marketplace"."suppliers"("user_id");
CREATE INDEX IF NOT EXISTS "quote_requests_restaurant_id_idx" ON "marketplace"."quote_requests"("restaurant_id");
