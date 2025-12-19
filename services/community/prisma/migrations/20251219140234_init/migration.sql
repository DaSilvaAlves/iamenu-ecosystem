-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "community";

-- CreateTable
CREATE TABLE "community"."posts" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "group_id" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "thanks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community"."comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community"."groups" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "type" VARCHAR(20) NOT NULL DEFAULT 'public',
    "category" VARCHAR(50),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cover_image" TEXT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community"."group_memberships" (
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(20) NOT NULL DEFAULT 'member',

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateTable
CREATE TABLE "community"."profiles" (
    "user_id" TEXT NOT NULL,
    "restaurant_name" VARCHAR(200),
    "location_city" VARCHAR(100),
    "location_region" VARCHAR(100),
    "restaurant_type" VARCHAR(50),
    "bio" VARCHAR(200),
    "profile_photo" TEXT,
    "cover_photo" TEXT,
    "badges" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "community"."reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "target_type" VARCHAR(20) NOT NULL,
    "target_id" TEXT NOT NULL,
    "reaction_type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community"."notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "community"."posts"("author_id");

-- CreateIndex
CREATE INDEX "posts_group_id_idx" ON "community"."posts"("group_id");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "community"."posts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "community"."comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_author_id_idx" ON "community"."comments"("author_id");

-- CreateIndex
CREATE INDEX "comments_parent_comment_id_idx" ON "community"."comments"("parent_comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "community"."groups"("name");

-- CreateIndex
CREATE INDEX "reactions_target_id_idx" ON "community"."reactions"("target_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_user_id_target_type_target_id_reaction_type_key" ON "community"."reactions"("user_id", "target_type", "target_id", "reaction_type");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_idx" ON "community"."notifications"("user_id", "read");

-- AddForeignKey
ALTER TABLE "community"."posts" ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community"."groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community"."comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community"."comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "community"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community"."group_memberships" ADD CONSTRAINT "group_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
