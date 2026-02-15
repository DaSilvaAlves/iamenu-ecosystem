-- Performance Optimization: Add indexes for frequently used queries

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON marketplace.quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON marketplace.quotes(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_reviews_supplier_id ON marketplace.reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON marketplace.supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product_id ON marketplace.supplier_products(product_id);

-- Frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON marketplace.suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON marketplace.suppliers(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON marketplace.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON marketplace.quote_requests(status);

-- Search and location filters
CREATE INDEX IF NOT EXISTS idx_suppliers_city ON marketplace.suppliers(location_city);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON marketplace.suppliers USING GIN(categories);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_verified_rating ON marketplace.suppliers(verified, rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_status_created ON marketplace.quotes(supplier_id, status, created_at DESC);
