import { Request, Response } from 'express';
import * as coursesService from '../services/courses.service';

// ===================================
// Get All Courses
// ===================================

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { category, level, published, search, limit, offset } = req.query;

    const result = await coursesService.getCourses({
      category: category as string,
      level: level as string,
      published: published === 'false' ? false : true,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// ===================================
// Get Course by ID/Slug
// ===================================

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const course = await coursesService.getCourseById(idOrSlug);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// ===================================
// Create Course
// ===================================

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, slug, category, level, durationMinutes, price, published } = req.body;

    if (!title || !slug || !category || !level || !durationMinutes) {
      return res.status(400).json({
        message: 'Missing required fields: title, slug, category, level, durationMinutes',
      });
    }

    const course = await coursesService.createCourse({
      title,
      slug,
      category,
      level,
      durationMinutes: parseInt(durationMinutes, 10),
      price: price ? parseFloat(price) : undefined,
      published: published === true || published === 'true',
    });

    res.status(201).json(course);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// ===================================
// Update Course
// ===================================

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const course = await coursesService.updateCourse(id, data);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// ===================================
// Delete Course
// ===================================

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await coursesService.deleteCourse(id);

    if (!result) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully', ...result });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// ===================================
// Add Module
// ===================================

export const addModule = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;
    const { title, order } = req.body;

    if (!title || order === undefined) {
      return res.status(400).json({ message: 'Missing required fields: title, order' });
    }

    const module = await coursesService.addModule({
      courseId,
      title,
      order: parseInt(order, 10),
    });

    res.status(201).json(module);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding module', error: error.message });
  }
};

// ===================================
// Add Lesson
// ===================================

export const addLesson = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { title, videoUrl, order } = req.body;

    if (!title || order === undefined) {
      return res.status(400).json({ message: 'Missing required fields: title, order' });
    }

    const lesson = await coursesService.addLesson({
      moduleId,
      title,
      videoUrl,
      order: parseInt(order, 10),
    });

    res.status(201).json(lesson);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};

// ===================================
// Get Categories
// ===================================

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await coursesService.getCategories();
    res.status(200).json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};
