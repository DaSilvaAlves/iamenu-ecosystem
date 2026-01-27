import { Router } from 'express';
import * as coursesController from '../controllers/courses.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// ===================================
// Public Routes
// ===================================

// GET /courses - List all published courses
router.get('/', coursesController.getCourses);

// GET /courses/categories - Get all categories
router.get('/categories', coursesController.getCategories);

// GET /courses/:idOrSlug - Get course by ID or slug
router.get('/:idOrSlug', coursesController.getCourseById);

// ===================================
// Protected Routes (Admin)
// ===================================

// POST /courses - Create new course
router.post('/', authenticateJWT, coursesController.createCourse);

// PATCH /courses/:id - Update course
router.patch('/:id', authenticateJWT, coursesController.updateCourse);

// DELETE /courses/:id - Delete course
router.delete('/:id', authenticateJWT, coursesController.deleteCourse);

// POST /courses/:id/modules - Add module to course
router.post('/:id/modules', authenticateJWT, coursesController.addModule);

// POST /modules/:moduleId/lessons - Add lesson to module
router.post('/modules/:moduleId/lessons', authenticateJWT, coursesController.addLesson);

export default router;
