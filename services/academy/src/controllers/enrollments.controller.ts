import { Request, Response } from 'express';
import * as enrollmentsService from '../services/enrollments.service';

// ===================================
// Enroll in Course
// ===================================

export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const enrollment = await enrollmentsService.enrollUser(userId, courseId);
    res.status(201).json(enrollment);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('already enrolled') || error.message.includes('not available')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// ===================================
// Get User Enrollments
// ===================================

export const getUserEnrollments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const enrollments = await enrollmentsService.getUserEnrollments(userId);
    res.status(200).json({ enrollments, total: enrollments.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

// ===================================
// Get Enrollment Details
// ===================================

export const getEnrollmentDetails = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;

    const enrollment = await enrollmentsService.getEnrollmentDetails(userId, courseId);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json(enrollment);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching enrollment', error: error.message });
  }
};

// ===================================
// Mark Course as Completed
// ===================================

export const markCourseCompleted = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;

    const enrollment = await enrollmentsService.markCourseCompleted(userId, courseId);
    res.status(200).json(enrollment);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('already')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error marking course as completed', error: error.message });
  }
};

// ===================================
// Unenroll from Course
// ===================================

export const unenrollFromCourse = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;

    const result = await enrollmentsService.unenrollUser(userId, courseId);

    if (!result) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json({ message: 'Successfully unenrolled', ...result });
  } catch (error: any) {
    res.status(500).json({ message: 'Error unenrolling from course', error: error.message });
  }
};
