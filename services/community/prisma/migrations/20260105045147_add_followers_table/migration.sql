-- CreateTable
CREATE TABLE "community"."followers" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "followers_followerId_idx" ON "community"."followers"("followerId");

-- CreateIndex
CREATE INDEX "followers_followingId_idx" ON "community"."followers"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "followers_followerId_followingId_key" ON "community"."followers"("followerId", "followingId");
