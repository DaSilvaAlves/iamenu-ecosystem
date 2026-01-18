/*
  Warnings:

  - You are about to drop the column `committedQuantity` on the `bargain_adhesions` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `collective_bargains` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `price_history` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `price_history` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryZones` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the `review_helpfuls` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[product_id,supplier_id,date]` on the table `price_history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `committed_quantity` to the `bargain_adhesions` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating_quality` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_delivery` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_price` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_service` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating_avg` on table `suppliers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "collective_bargains" DROP CONSTRAINT "collective_bargains_product_id_fkey";

-- DropForeignKey
ALTER TABLE "review_helpfuls" DROP CONSTRAINT "review_helpfuls_review_id_fkey";

-- AlterTable
ALTER TABLE "bargain_adhesions" DROP COLUMN "committedQuantity",
ADD COLUMN     "committed_quantity" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "collective_bargains" DROP COLUMN "product_id",
ALTER COLUMN "participants" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "target_price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "price_history" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating_quality" SET NOT NULL,
ALTER COLUMN "rating_delivery" SET NOT NULL,
ALTER COLUMN "rating_price" SET NOT NULL,
ALTER COLUMN "rating_service" SET NOT NULL;

-- AlterTable
ALTER TABLE "supplier_products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "deliveryZones",
ADD COLUMN     "delivery_zones" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "header_image_url" TEXT,
ALTER COLUMN "categories" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "min_order" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "certifications" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "rating_avg" SET NOT NULL,
ALTER COLUMN "rating_avg" SET DATA TYPE DECIMAL(65,30);

-- DropTable
DROP TABLE "review_helpfuls";

-- CreateIndex
CREATE UNIQUE INDEX "price_history_product_id_supplier_id_date_key" ON "price_history"("product_id", "supplier_id", "date");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "reviews_supplier_id_idx" ON "reviews"("supplier_id");

-- CreateIndex
CREATE INDEX "supplier_products_supplier_id_idx" ON "supplier_products"("supplier_id");

-- CreateIndex
CREATE INDEX "suppliers_location_region_idx" ON "suppliers"("location_region");

-- CreateIndex
CREATE INDEX "suppliers_rating_avg_idx" ON "suppliers"("rating_avg" DESC);

-- CreateIndex
CREATE INDEX "suppliers_categories_idx" ON "suppliers"("categories");
