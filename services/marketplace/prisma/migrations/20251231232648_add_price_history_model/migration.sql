-- CreateTable
CREATE TABLE "marketplace"."price_history" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "marketplace"."price_history" ADD CONSTRAINT "price_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "marketplace"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace"."price_history" ADD CONSTRAINT "price_history_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "marketplace"."suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
