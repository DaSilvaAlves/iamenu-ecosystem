-- CreateTable: User Warnings/Strikes
CREATE TABLE "community"."user_warnings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "details" TEXT,
    "reportId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_warnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Moderation Action Log
CREATE TABLE "community"."moderation_logs" (
    "id" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: User Ban Status
CREATE TABLE "community"."user_bans" (
    "userId" TEXT NOT NULL,
    "bannedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'permanent',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_bans_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex: user_warnings
CREATE INDEX "user_warnings_userId_idx" ON "community"."user_warnings"("userId");
CREATE INDEX "user_warnings_userId_createdAt_idx" ON "community"."user_warnings"("userId", "createdAt" DESC);
CREATE INDEX "user_warnings_severity_idx" ON "community"."user_warnings"("severity");

-- CreateIndex: moderation_logs
CREATE INDEX "moderation_logs_moderatorId_idx" ON "community"."moderation_logs"("moderatorId");
CREATE INDEX "moderation_logs_action_idx" ON "community"."moderation_logs"("action");
CREATE INDEX "moderation_logs_targetType_targetId_idx" ON "community"."moderation_logs"("targetType", "targetId");
CREATE INDEX "moderation_logs_createdAt_idx" ON "community"."moderation_logs"("createdAt" DESC);

-- CreateIndex: user_bans
CREATE INDEX "user_bans_expiresAt_idx" ON "community"."user_bans"("expiresAt");
