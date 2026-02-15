-- Performance Optimization: Add indexes for Academy service

-- Foreign keys
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON academy.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON academy.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON academy.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON academy.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_enrollment_id ON academy.certificates(enrollment_id);

-- Frequently filtered
CREATE INDEX IF NOT EXISTS idx_courses_published ON academy.courses(published);
CREATE INDEX IF NOT EXISTS idx_courses_category ON academy.courses(category);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON academy.enrollments(status);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON academy.enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON academy.lessons(module_id, "order");
