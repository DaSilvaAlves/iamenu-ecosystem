-- CreateTable
CREATE TABLE "marketplace"."bargain_adhesions" (
    "id" TEXT NOT NULL,
    "collective_bargain_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "committedQuantity" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bargain_adhesions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bargain_adhesions_collective_bargain_id_user_id_key" ON "marketplace"."bargain_adhesions"("collective_bargain_id", "user_id");

-- AddForeignKey
ALTER TABLE "marketplace"."bargain_adhesions" ADD CONSTRAINT "bargain_adhesions_collective_bargain_id_fkey" FOREIGN KEY ("collective_bargain_id") REFERENCES "marketplace"."collective_bargains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
