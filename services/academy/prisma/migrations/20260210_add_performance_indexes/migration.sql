-- Sprint 1 Task 1.3: Add Performance Indexes for Academy

-- Course indexes
CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "academy"."courses"("category");
CREATE INDEX IF NOT EXISTS "courses_published_idx" ON "academy"."courses"("published");
CREATE INDEX IF NOT EXISTS "courses_level_idx" ON "academy"."courses"("level");

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS "enrollments_user_id_idx" ON "academy"."enrollments"("user_id");
CREATE INDEX IF NOT EXISTS "enrollments_course_id_idx" ON "academy"."enrollments"("course_id");

-- Certificate indexes
CREATE INDEX IF NOT EXISTS "certificates_user_id_idx" ON "academy"."certificates"("user_id");
CREATE INDEX IF NOT EXISTS "certificates_course_id_idx" ON "academy"."certificates"("course_id");
