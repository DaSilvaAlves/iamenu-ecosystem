-- RLS Policies for Academy Schema
-- Task 1.1.2: Row-Level Security Implementation
-- Uses PostgreSQL session variables: SET app.current_user_id = 'user-id';

-- ============================================
-- 1. ENABLE RLS on enrollments table
-- ============================================
ALTER TABLE "academy"."enrollments" ENABLE ROW LEVEL SECURITY;

-- Policy 1a: Student sees own enrollments only
CREATE POLICY "enrollments_student_policy" ON "academy"."enrollments"
  FOR ALL
  USING ("user_id" = current_setting('app.current_user_id'));


-- ============================================
-- 2. Indexes for RLS performance
-- ============================================
CREATE INDEX IF NOT EXISTS "enrollments_user_id_idx" ON "academy"."enrollments"("user_id");
CREATE INDEX IF NOT EXISTS "enrollments_course_id_idx" ON "academy"."enrollments"("course_id");
