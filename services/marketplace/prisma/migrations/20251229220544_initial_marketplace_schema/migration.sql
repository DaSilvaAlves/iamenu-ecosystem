-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "community";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "marketplace";

-- CreateTable
CREATE TABLE "marketplace"."suppliers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "categories" TEXT[],
    "location_city" TEXT,
    "location_region" TEXT,
    "national_delivery" BOOLEAN NOT NULL DEFAULT false,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "contact_website" TEXT,
    "products_description" TEXT,
    "catalog_pdf_url" TEXT,
    "price_list_public" BOOLEAN NOT NULL DEFAULT false,
    "deliveryZones" TEXT[],
    "delivery_cost" TEXT,
    "delivery_frequency" TEXT,
    "min_order" DECIMAL(10,2),
    "payment_terms" TEXT,
    "certifications" TEXT[],
    "rating_avg" DECIMAL(3,2) DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."reviews" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "rating_overall" INTEGER NOT NULL,
    "rating_quality" INTEGER,
    "rating_delivery" INTEGER,
    "rating_price" INTEGER,
    "rating_service" INTEGER,
    "comment" TEXT,
    "recommend" BOOLEAN,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "unhelpful_count" INTEGER NOT NULL DEFAULT 0,
    "supplier_response" TEXT,
    "supplier_response_at" TIMESTAMP(3),
    "verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "subcategory" TEXT,
    "unit" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."supplier_products" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "unit" TEXT,
    "min_quantity" INTEGER,
    "delivery_included" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."quote_requests" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "suppliers" TEXT[],
    "items" JSONB NOT NULL,
    "delivery_frequency" TEXT,
    "delivery_address" TEXT,
    "notes" TEXT,
    "preferred_start_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."quotes" (
    "id" TEXT NOT NULL,
    "quote_request_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "delivery_terms" TEXT,
    "payment_terms" TEXT,
    "valid_until" DATE,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."collective_bargains" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "supplier_id" TEXT,
    "product_name" TEXT NOT NULL,
    "product_id" TEXT,
    "category" TEXT,
    "target_participants" INTEGER,
    "current_participants" INTEGER NOT NULL DEFAULT 1,
    "participants" TEXT[],
    "target_discount" TEXT,
    "target_price" DECIMAL(10,2),
    "deadline" DATE,
    "status" TEXT NOT NULL DEFAULT 'open',
    "supplier_offer" JSONB,
    "community_group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collective_bargains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace"."review_helpfuls" (
    "review_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,

    CONSTRAINT "review_helpfuls_pkey" PRIMARY KEY ("review_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_supplier_id_reviewer_id_key" ON "marketplace"."reviews"("supplier_id", "reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_products_supplier_id_product_id_key" ON "marketplace"."supplier_products"("supplier_id", "product_id");

-- AddForeignKey
ALTER TABLE "marketplace"."reviews" ADD CONSTRAINT "reviews_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."supplier_products" ADD CONSTRAINT "supplier_products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."supplier_products" ADD CONSTRAINT "supplier_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "marketplace"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."quotes" ADD CONSTRAINT "quotes_quote_request_id_fkey" FOREIGN KEY ("quote_request_id") REFERENCES "marketplace"."quote_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."quotes" ADD CONSTRAINT "quotes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."collective_bargains" ADD CONSTRAINT "collective_bargains_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."collective_bargains" ADD CONSTRAINT "collective_bargains_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "marketplace"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."review_helpfuls" ADD CONSTRAINT "review_helpfuls_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "marketplace"."reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
