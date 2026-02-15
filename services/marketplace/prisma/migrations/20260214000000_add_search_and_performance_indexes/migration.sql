-- Migration: Add Full-Text Search & Performance Optimization Indexes (Marketplace)
-- Story 3.5 (Full-Text Search) & Story 3.2 (Query Optimization)
-- Date: 2026-02-14

-- ============================================
-- FULL-TEXT SEARCH INDEXES (GIN)
-- For Story 3.5: Full-Text Search Implementation
-- ============================================

-- Products: Full-text search on name + description
CREATE INDEX IF NOT EXISTS idx_products_search_gin
  ON "marketplace"."Product" USING GIN(to_tsvector('portuguese', "name" || ' ' || COALESCE("description", '')));

-- Suppliers: Full-text search on name + description
CREATE INDEX IF NOT EXISTS idx_suppliers_search_gin
  ON "marketplace"."Supplier" USING GIN(to_tsvector('portuguese', "name" || ' ' || COALESCE("description", '')));

-- ============================================
-- FOREIGN KEY INDEXES (Performance)
-- For Story 3.2: Query Optimization - N+1 pattern fixes
-- ============================================

-- Quotes: Supplier lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON "marketplace"."Quote"("supplierId");

-- Quotes: Request lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON "marketplace"."Quote"("quoteRequestId");

-- Quote Requests: Restaurant lookup
CREATE INDEX IF NOT EXISTS idx_quote_requests_restaurant_id ON "marketplace"."QuoteRequest"("restaurantId");

-- SupplierProducts: Supplier lookup
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON "marketplace"."SupplierProduct"("supplierId");

-- SupplierProducts: Product lookup
CREATE INDEX IF NOT EXISTS idx_supplier_products_product_id ON "marketplace"."SupplierProduct"("productId");

-- PriceHistory: SupplierProduct lookup
CREATE INDEX IF NOT EXISTS idx_price_history_supplier_product_id ON "marketplace"."PriceHistory"("supplierProductId");

-- ============================================
-- FILTER COLUMN INDEXES (Performance)
-- Optimize sorting and filtering operations
-- ============================================

-- Quotes: Status filter
CREATE INDEX IF NOT EXISTS idx_quotes_status ON "marketplace"."Quote"("status");

-- Quotes: Created timestamp
CREATE INDEX IF NOT EXISTS idx_quotes_created_at_desc ON "marketplace"."Quote"("createdAt" DESC);

-- QuoteRequests: Status filter
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON "marketplace"."QuoteRequest"("status");

-- QuoteRequests: Created timestamp
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at_desc ON "marketplace"."QuoteRequest"("createdAt" DESC);

-- ============================================
-- COMPOSITE INDEXES (Complex queries)
-- ============================================

-- Quotes: Supplier + Status (supplier dashboard queries)
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_status ON "marketplace"."Quote"("supplierId", "status");

-- Quotes: Request + Created (thread queries)
CREATE INDEX IF NOT EXISTS idx_quotes_request_created ON "marketplace"."Quote"("quoteRequestId", "createdAt" DESC);
