/**
 * Academy Progress Tracking Tests
 * US-1.1.1 - Sprint 1 Quality Assurance
 *
 * Tests for: Enrollment flow, Progress tracking, Course completion
 * Coverage Target: Core progress tracking functions
 */

// Mock Prisma - must be before imports due to hoisting
const mockPrismaMethods = {
  course: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  enrollment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  module: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  lesson: {
    create: jest.fn(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockPrismaMethods,
}));

import * as enrollmentsService from '../src/services/enrollments.service';
import * as coursesService from '../src/services/courses.service';

// Reference to mock for tests
const mockPrisma = mockPrismaMethods;

describe('Enrollments Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollUser', () => {
    const mockCourse = {
      id: 'course-1',
      title: 'Test Course',
      slug: 'test-course',
      published: true,
    };

    it('GIVEN valid course WHEN enrollUser THEN creates enrollment', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.enrollment.create as jest.Mock).mockResolvedValue({
        id: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        enrolledAt: new Date(),
        course: mockCourse,
      });

      // Act
      const result = await enrollmentsService.enrollUser('user-1', 'course-1');

      // Assert
      expect(result.userId).toBe('user-1');
      expect(result.courseId).toBe('course-1');
      expect(mockPrisma.enrollment.create).toHaveBeenCalled();
    });

    it('GIVEN non-existent course WHEN enrollUser THEN throws error', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(enrollmentsService.enrollUser('user-1', 'invalid-course'))
        .rejects.toThrow('Course not found');
    });

    it('GIVEN unpublished course WHEN enrollUser THEN throws error', async () => {
      // Arrange
      const unpublishedCourse = { ...mockCourse, published: false };
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(unpublishedCourse);

      // Act & Assert
      await expect(enrollmentsService.enrollUser('user-1', 'course-1'))
        .rejects.toThrow('Course is not available for enrollment');
    });

    it('GIVEN already enrolled user WHEN enrollUser THEN throws error', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-enrollment',
        userId: 'user-1',
        courseId: 'course-1',
      });

      // Act & Assert
      await expect(enrollmentsService.enrollUser('user-1', 'course-1'))
        .rejects.toThrow('User is already enrolled in this course');
    });
  });

  describe('getUserEnrollments', () => {
    it('GIVEN user with enrollments WHEN getUserEnrollments THEN returns list', async () => {
      // Arrange
      const mockEnrollments = [
        {
          id: 'enroll-1',
          userId: 'user-1',
          courseId: 'course-1',
          enrolledAt: new Date(),
          course: { id: 'course-1', title: 'Course 1', modules: [] },
        },
        {
          id: 'enroll-2',
          userId: 'user-1',
          courseId: 'course-2',
          enrolledAt: new Date(),
          course: { id: 'course-2', title: 'Course 2', modules: [] },
        },
      ];
      (mockPrisma.enrollment.findMany as jest.Mock).mockResolvedValue(mockEnrollments);

      // Act
      const result = await enrollmentsService.getUserEnrollments('user-1');

      // Assert
      expect(result).toHaveLength(2);
      expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        })
      );
    });

    it('GIVEN user with no enrollments WHEN getUserEnrollments THEN returns empty array', async () => {
      // Arrange
      (mockPrisma.enrollment.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await enrollmentsService.getUserEnrollments('user-1');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('GIVEN enrollments WHEN getUserEnrollments THEN orders by enrolledAt desc', async () => {
      // Arrange
      (mockPrisma.enrollment.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      await enrollmentsService.getUserEnrollments('user-1');

      // Assert
      expect(mockPrisma.enrollment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { enrolledAt: 'desc' },
        })
      );
    });
  });

  describe('getEnrollmentDetails', () => {
    it('GIVEN valid enrollment WHEN getEnrollmentDetails THEN returns with course', async () => {
      // Arrange
      const mockEnrollment = {
        id: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        enrolledAt: new Date(),
        completedAt: null,
        course: {
          id: 'course-1',
          title: 'Test Course',
          modules: [
            { id: 'mod-1', title: 'Module 1', lessons: [] },
          ],
        },
      };
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(mockEnrollment);

      // Act
      const result = await enrollmentsService.getEnrollmentDetails('user-1', 'course-1');

      // Assert
      expect(result).toBeDefined();
      expect(result?.course.title).toBe('Test Course');
    });

    it('GIVEN non-existent enrollment WHEN getEnrollmentDetails THEN returns null', async () => {
      // Arrange
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await enrollmentsService.getEnrollmentDetails('user-1', 'invalid');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('markCourseCompleted', () => {
    it('GIVEN valid enrollment WHEN markCourseCompleted THEN sets completedAt', async () => {
      // Arrange
      const mockEnrollment = {
        id: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        completedAt: null,
      };
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(mockEnrollment);
      (mockPrisma.enrollment.update as jest.Mock).mockResolvedValue({
        ...mockEnrollment,
        completedAt: new Date(),
        course: { id: 'course-1', title: 'Test Course' },
      });

      // Act
      const result = await enrollmentsService.markCourseCompleted('user-1', 'course-1');

      // Assert
      expect(result.completedAt).toBeDefined();
      expect(mockPrisma.enrollment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            completedAt: expect.any(Date),
          }),
        })
      );
    });

    it('GIVEN non-existent enrollment WHEN markCourseCompleted THEN throws error', async () => {
      // Arrange
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(enrollmentsService.markCourseCompleted('user-1', 'invalid'))
        .rejects.toThrow('Enrollment not found');
    });

    it('GIVEN already completed course WHEN markCourseCompleted THEN throws error', async () => {
      // Arrange
      const completedEnrollment = {
        id: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
        completedAt: new Date('2024-01-01'),
      };
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(completedEnrollment);

      // Act & Assert
      await expect(enrollmentsService.markCourseCompleted('user-1', 'course-1'))
        .rejects.toThrow('Course already marked as completed');
    });
  });

  describe('unenrollUser', () => {
    it('GIVEN valid enrollment WHEN unenrollUser THEN deletes and returns success', async () => {
      // Arrange
      const mockEnrollment = {
        id: 'enroll-1',
        userId: 'user-1',
        courseId: 'course-1',
      };
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(mockEnrollment);
      (mockPrisma.enrollment.delete as jest.Mock).mockResolvedValue(mockEnrollment);

      // Act
      const result = await enrollmentsService.unenrollUser('user-1', 'course-1');

      // Assert
      expect(result).toEqual({ deleted: true, userId: 'user-1', courseId: 'course-1' });
      expect(mockPrisma.enrollment.delete).toHaveBeenCalled();
    });

    it('GIVEN non-existent enrollment WHEN unenrollUser THEN returns null', async () => {
      // Arrange
      (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await enrollmentsService.unenrollUser('user-1', 'invalid');

      // Assert
      expect(result).toBeNull();
      expect(mockPrisma.enrollment.delete).not.toHaveBeenCalled();
    });
  });
});

describe('Courses Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('GIVEN no filters WHEN getCourses THEN returns published courses', async () => {
      // Arrange
      const mockCourses = [
        { id: '1', title: 'Course 1', published: true },
        { id: '2', title: 'Course 2', published: true },
      ];
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(2);

      // Act
      const result = await coursesService.getCourses({});

      // Assert
      expect(result.courses).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('GIVEN category filter WHEN getCourses THEN filters by category', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(0);

      // Act
      await coursesService.getCourses({ category: 'cooking' });

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'cooking',
          }),
        })
      );
    });

    it('GIVEN level filter WHEN getCourses THEN filters by level', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(0);

      // Act
      await coursesService.getCourses({ level: 'beginner' });

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            level: 'beginner',
          }),
        })
      );
    });

    it('GIVEN search term WHEN getCourses THEN searches title and category', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(0);

      // Act
      await coursesService.getCourses({ search: 'pizza' });

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.any(Object) }),
              expect.objectContaining({ category: expect.any(Object) }),
            ]),
          }),
        })
      );
    });

    it('GIVEN pagination params WHEN getCourses THEN applies limit and offset', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(0);

      // Act
      await coursesService.getCourses({ limit: 10, offset: 20 });

      // Assert
      expect(mockPrisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 20,
        })
      );
    });

    it('GIVEN default params WHEN getCourses THEN uses limit 20 offset 0', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.course.count as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await coursesService.getCourses({});

      // Assert
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });
  });

  describe('getCourseById', () => {
    it('GIVEN valid ID WHEN getCourseById THEN returns course with modules', async () => {
      // Arrange
      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        modules: [
          { id: 'mod-1', title: 'Module 1', lessons: [] },
        ],
      };
      (mockPrisma.course.findFirst as jest.Mock).mockResolvedValue(mockCourse);

      // Act
      const result = await coursesService.getCourseById('course-1');

      // Assert
      expect(result).toBeDefined();
      expect(result?.modules).toHaveLength(1);
    });

    it('GIVEN valid slug WHEN getCourseById THEN returns course', async () => {
      // Arrange
      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        slug: 'test-course',
      };
      (mockPrisma.course.findFirst as jest.Mock).mockResolvedValue(mockCourse);

      // Act
      const result = await coursesService.getCourseById('test-course');

      // Assert
      expect(result).toBeDefined();
      expect(mockPrisma.course.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { id: 'test-course' },
              { slug: 'test-course' },
            ],
          },
        })
      );
    });

    it('GIVEN non-existent course WHEN getCourseById THEN returns null', async () => {
      // Arrange
      (mockPrisma.course.findFirst as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await coursesService.getCourseById('invalid');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('createCourse', () => {
    const courseData = {
      title: 'New Course',
      slug: 'new-course',
      category: 'cooking',
      level: 'beginner',
      durationMinutes: 60,
    };

    it('GIVEN valid data WHEN createCourse THEN creates and returns course', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.course.create as jest.Mock).mockResolvedValue({
        id: 'new-id',
        ...courseData,
        price: 0,
        published: false,
      });

      // Act
      const result = await coursesService.createCourse(courseData);

      // Assert
      expect(result.title).toBe('New Course');
      expect(result.slug).toBe('new-course');
    });

    it('GIVEN duplicate slug WHEN createCourse THEN throws error', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing',
        slug: 'new-course',
      });

      // Act & Assert
      await expect(coursesService.createCourse(courseData))
        .rejects.toThrow('Course with this slug already exists');
    });

    it('GIVEN optional price WHEN createCourse THEN defaults to 0', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.course.create as jest.Mock).mockResolvedValue({
        id: 'new-id',
        ...courseData,
        price: 0,
        published: false,
      });

      // Act
      await coursesService.createCourse(courseData);

      // Assert
      expect(mockPrisma.course.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            price: 0,
          }),
        })
      );
    });
  });

  describe('updateCourse', () => {
    it('GIVEN valid ID and data WHEN updateCourse THEN updates course', async () => {
      // Arrange
      const existingCourse = {
        id: 'course-1',
        title: 'Old Title',
        slug: 'old-slug',
      };
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(existingCourse);
      (mockPrisma.course.update as jest.Mock).mockResolvedValue({
        ...existingCourse,
        title: 'New Title',
      });

      // Act
      const result = await coursesService.updateCourse('course-1', { title: 'New Title' });

      // Assert
      expect(result?.title).toBe('New Title');
    });

    it('GIVEN non-existent course WHEN updateCourse THEN returns null', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await coursesService.updateCourse('invalid', { title: 'New' });

      // Assert
      expect(result).toBeNull();
    });

    it('GIVEN conflicting slug WHEN updateCourse THEN throws error', async () => {
      // Arrange
      const existingCourse = { id: 'course-1', slug: 'old-slug' };
      (mockPrisma.course.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingCourse) // First call: find course to update
        .mockResolvedValueOnce({ id: 'other', slug: 'taken-slug' }); // Second call: check slug conflict

      // Act & Assert
      await expect(coursesService.updateCourse('course-1', { slug: 'taken-slug' }))
        .rejects.toThrow('Course with this slug already exists');
    });
  });

  describe('deleteCourse', () => {
    it('GIVEN existing course WHEN deleteCourse THEN deletes and returns success', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue({ id: 'course-1' });
      (mockPrisma.course.delete as jest.Mock).mockResolvedValue({ id: 'course-1' });

      // Act
      const result = await coursesService.deleteCourse('course-1');

      // Assert
      expect(result).toEqual({ deleted: true, courseId: 'course-1' });
    });

    it('GIVEN non-existent course WHEN deleteCourse THEN returns null', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await coursesService.deleteCourse('invalid');

      // Assert
      expect(result).toBeNull();
      expect(mockPrisma.course.delete).not.toHaveBeenCalled();
    });
  });

  describe('addModule', () => {
    it('GIVEN valid course WHEN addModule THEN creates module', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue({ id: 'course-1' });
      (mockPrisma.module.create as jest.Mock).mockResolvedValue({
        id: 'mod-1',
        courseId: 'course-1',
        title: 'Module 1',
        order: 1,
        lessons: [],
      });

      // Act
      const result = await coursesService.addModule({
        courseId: 'course-1',
        title: 'Module 1',
        order: 1,
      });

      // Assert
      expect(result.title).toBe('Module 1');
      expect(result.order).toBe(1);
    });

    it('GIVEN non-existent course WHEN addModule THEN throws error', async () => {
      // Arrange
      (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(coursesService.addModule({
        courseId: 'invalid',
        title: 'Module 1',
        order: 1,
      })).rejects.toThrow('Course not found');
    });
  });

  describe('addLesson', () => {
    it('GIVEN valid module WHEN addLesson THEN creates lesson', async () => {
      // Arrange
      (mockPrisma.module.findUnique as jest.Mock).mockResolvedValue({ id: 'mod-1' });
      (mockPrisma.lesson.create as jest.Mock).mockResolvedValue({
        id: 'lesson-1',
        moduleId: 'mod-1',
        title: 'Lesson 1',
        order: 1,
        videoUrl: null,
      });

      // Act
      const result = await coursesService.addLesson({
        moduleId: 'mod-1',
        title: 'Lesson 1',
        order: 1,
      });

      // Assert
      expect(result.title).toBe('Lesson 1');
    });

    it('GIVEN video URL WHEN addLesson THEN includes videoUrl', async () => {
      // Arrange
      (mockPrisma.module.findUnique as jest.Mock).mockResolvedValue({ id: 'mod-1' });
      (mockPrisma.lesson.create as jest.Mock).mockResolvedValue({
        id: 'lesson-1',
        moduleId: 'mod-1',
        title: 'Lesson 1',
        order: 1,
        videoUrl: 'https://video.url',
      });

      // Act
      const result = await coursesService.addLesson({
        moduleId: 'mod-1',
        title: 'Lesson 1',
        order: 1,
        videoUrl: 'https://video.url',
      });

      // Assert
      expect(result.videoUrl).toBe('https://video.url');
    });

    it('GIVEN non-existent module WHEN addLesson THEN throws error', async () => {
      // Arrange
      (mockPrisma.module.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(coursesService.addLesson({
        moduleId: 'invalid',
        title: 'Lesson 1',
        order: 1,
      })).rejects.toThrow('Module not found');
    });
  });

  describe('getCategories', () => {
    it('GIVEN published courses WHEN getCategories THEN returns distinct categories', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([
        { category: 'cooking' },
        { category: 'management' },
        { category: 'hygiene' },
      ]);

      // Act
      const result = await coursesService.getCategories();

      // Assert
      expect(result).toEqual(['cooking', 'management', 'hygiene']);
    });

    it('GIVEN no published courses WHEN getCategories THEN returns empty array', async () => {
      // Arrange
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await coursesService.getCategories();

      // Assert
      expect(result).toEqual([]);
    });
  });
});

describe('Progress Tracking: Integration Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN user journey WHEN enrolls and completes THEN progress is tracked', async () => {
    // Arrange - Course exists and is published
    const mockCourse = { id: 'course-1', title: 'Test', published: true };
    (mockPrisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);
    (mockPrisma.enrollment.findUnique as jest.Mock)
      .mockResolvedValueOnce(null) // Not enrolled yet
      .mockResolvedValueOnce({ id: 'e1', userId: 'user-1', courseId: 'course-1', completedAt: null }); // After enrollment

    (mockPrisma.enrollment.create as jest.Mock).mockResolvedValue({
      id: 'e1',
      userId: 'user-1',
      courseId: 'course-1',
      enrolledAt: new Date(),
      course: mockCourse,
    });

    (mockPrisma.enrollment.update as jest.Mock).mockResolvedValue({
      id: 'e1',
      userId: 'user-1',
      courseId: 'course-1',
      completedAt: new Date(),
      course: mockCourse,
    });

    // Act - Step 1: Enroll
    const enrollment = await enrollmentsService.enrollUser('user-1', 'course-1');
    expect(enrollment.courseId).toBe('course-1');

    // Act - Step 2: Complete
    const completed = await enrollmentsService.markCourseCompleted('user-1', 'course-1');
    expect(completed.completedAt).toBeDefined();
  });

  it('GIVEN completed course WHEN trying to re-complete THEN fails gracefully', async () => {
    // Arrange
    const completedEnrollment = {
      id: 'e1',
      userId: 'user-1',
      courseId: 'course-1',
      completedAt: new Date('2024-01-01'),
    };
    (mockPrisma.enrollment.findUnique as jest.Mock).mockResolvedValue(completedEnrollment);

    // Act & Assert
    await expect(enrollmentsService.markCourseCompleted('user-1', 'course-1'))
      .rejects.toThrow('Course already marked as completed');
  });
});
