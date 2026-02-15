-- Migration: Add Full-Text Search & Performance Optimization Indexes (Academy)
-- Story 3.5 (Full-Text Search) & Story 3.2 (Query Optimization)
-- Date: 2026-02-14

-- ============================================
-- FULL-TEXT SEARCH INDEXES (GIN)
-- For Story 3.5: Full-Text Search Implementation
-- ============================================

-- Courses: Full-text search on title + description
CREATE INDEX IF NOT EXISTS idx_courses_search_gin
  ON "academy"."Course" USING GIN(to_tsvector('portuguese', "title" || ' ' || COALESCE("description", '')));

-- Lessons: Full-text search on title + content
CREATE INDEX IF NOT EXISTS idx_lessons_search_gin
  ON "academy"."Lesson" USING GIN(to_tsvector('portuguese', "title" || ' ' || COALESCE("content", '')));

-- ============================================
-- FOREIGN KEY INDEXES (Performance)
-- For Story 3.2: Query Optimization - N+1 pattern fixes
-- ============================================

-- Modules: Course lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON "academy"."Module"("courseId");

-- Lessons: Module lookup (N+1 pattern)
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON "academy"."Lesson"("moduleId");

-- Enrollments: Course lookup
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON "academy"."Enrollment"("courseId");

-- Enrollments: User lookup
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON "academy"."Enrollment"("userId");

-- Certificates: Enrollment lookup
CREATE INDEX IF NOT EXISTS idx_certificates_enrollment_id ON "academy"."Certificate"("enrollmentId");

-- ============================================
-- FILTER COLUMN INDEXES (Performance)
-- Optimize sorting and filtering operations
-- ============================================

-- Courses: Published status + Created timestamp
CREATE INDEX IF NOT EXISTS idx_courses_published_created ON "academy"."Course"("published", "createdAt" DESC);

-- Courses: Created timestamp
CREATE INDEX IF NOT EXISTS idx_courses_created_at_desc ON "academy"."Course"("createdAt" DESC);

-- Enrollments: Status filter
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON "academy"."Enrollment"("status");

-- Enrollments: Created timestamp
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at_desc ON "academy"."Enrollment"("createdAt" DESC);

-- ============================================
-- COMPOSITE INDEXES (Complex queries)
-- ============================================

-- Enrollments: User + Course (user progress queries)
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON "academy"."Enrollment"("userId", "courseId");

-- Lessons: Course + Published (course content queries)
CREATE INDEX IF NOT EXISTS idx_lessons_course_published ON "academy"."Lesson"("courseId", "published");
