-- Sprint 1 Task 1.1 & 1.3: Add Cascades and Array Indexes

-- Add onDelete Cascade to foreign keys
ALTER TABLE "marketplace"."reviews" DROP CONSTRAINT IF EXISTS "reviews_supplier_id_fkey";
ALTER TABLE "marketplace"."reviews" ADD CONSTRAINT "reviews_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace"."supplier_products" DROP CONSTRAINT IF EXISTS "supplier_products_supplier_id_fkey";
ALTER TABLE "marketplace"."supplier_products" ADD CONSTRAINT "supplier_products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace"."supplier_products" DROP CONSTRAINT IF EXISTS "supplier_products_product_id_fkey";
ALTER TABLE "marketplace"."supplier_products" ADD CONSTRAINT "supplier_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "marketplace"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace"."quotes" DROP CONSTRAINT IF EXISTS "quotes_quote_request_id_fkey";
ALTER TABLE "marketplace"."quotes" ADD CONSTRAINT "quotes_quote_request_id_fkey" FOREIGN KEY ("quote_request_id") REFERENCES "marketplace"."quote_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "marketplace"."quotes" DROP CONSTRAINT IF EXISTS "quotes_supplier_id_fkey";
ALTER TABLE "marketplace"."quotes" ADD CONSTRAINT "quotes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add indexes for array columns and performance
CREATE INDEX IF NOT EXISTS "suppliers_delivery_zones_idx" ON "marketplace"."suppliers" USING GIN ("delivery_zones");
CREATE INDEX IF NOT EXISTS "suppliers_certifications_idx" ON "marketplace"."suppliers" USING GIN ("certifications");
CREATE INDEX IF NOT EXISTS "quote_requests_restaurant_id_idx" ON "marketplace"."quote_requests"("restaurant_id");
CREATE INDEX IF NOT EXISTS "quote_requests_suppliers_idx" ON "marketplace"."quote_requests" USING GIN ("suppliers");
CREATE INDEX IF NOT EXISTS "collective_bargains_participants_idx" ON "marketplace"."collective_bargains" USING GIN ("participants");
