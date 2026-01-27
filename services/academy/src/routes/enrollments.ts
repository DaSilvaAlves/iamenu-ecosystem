import { Router } from 'express';
import * as enrollmentsController from '../controllers/enrollments.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// ===================================
// Enrollment Routes
// ===================================

// POST /enrollments/courses/:courseId - Enroll in a course
router.post('/courses/:courseId', authenticateJWT, enrollmentsController.enrollInCourse);

// GET /enrollments/users/:userId - Get user's enrollments
router.get('/users/:userId', authenticateJWT, enrollmentsController.getUserEnrollments);

// GET /enrollments/users/:userId/courses/:courseId - Get specific enrollment
router.get('/users/:userId/courses/:courseId', authenticateJWT, enrollmentsController.getEnrollmentDetails);

// POST /enrollments/users/:userId/courses/:courseId/complete - Mark course as completed
router.post('/users/:userId/courses/:courseId/complete', authenticateJWT, enrollmentsController.markCourseCompleted);

// DELETE /enrollments/users/:userId/courses/:courseId - Unenroll from course
router.delete('/users/:userId/courses/:courseId', authenticateJWT, enrollmentsController.unenrollFromCourse);

export default router;
