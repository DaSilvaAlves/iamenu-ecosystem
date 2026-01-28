-- CreateTable: User Points (cached XP totals for leaderboard)
CREATE TABLE "community"."user_points" (
    "userId" TEXT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_points_pkey" PRIMARY KEY ("userId")
);

-- CreateTable: Points History (log of all points earned)
CREATE TABLE "community"."points_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "points_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable: User Streaks (daily activity tracking)
CREATE TABLE "community"."user_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "actionsCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: user_points
CREATE INDEX "user_points_totalXP_idx" ON "community"."user_points"("totalXP" DESC);
CREATE INDEX "user_points_level_idx" ON "community"."user_points"("level" DESC);

-- CreateIndex: points_history
CREATE INDEX "points_history_userId_idx" ON "community"."points_history"("userId");
CREATE INDEX "points_history_userId_createdAt_idx" ON "community"."points_history"("userId", "createdAt" DESC);
CREATE INDEX "points_history_reason_idx" ON "community"."points_history"("reason");

-- CreateIndex: user_streaks
CREATE UNIQUE INDEX "user_streaks_userId_date_key" ON "community"."user_streaks"("userId", "date");
CREATE INDEX "user_streaks_userId_idx" ON "community"."user_streaks"("userId");
CREATE INDEX "user_streaks_date_idx" ON "community"."user_streaks"("date" DESC);
