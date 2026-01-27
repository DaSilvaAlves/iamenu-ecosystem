import prisma from '../lib/prisma';

// ===================================
// Enroll User in Course
// ===================================

export const enrollUser = async (userId: string, courseId: string) => {
  // Check if course exists and is published
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (!course.published) {
    throw new Error('Course is not available for enrollment');
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (existingEnrollment) {
    throw new Error('User is already enrolled in this course');
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
    include: {
      course: true,
    },
  });

  return enrollment;
};

// ===================================
// Get User Enrollments
// ===================================

export const getUserEnrollments = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments;
};

// ===================================
// Get Enrollment Details
// ===================================

export const getEnrollmentDetails = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  return enrollment;
};

// ===================================
// Mark Course as Completed
// ===================================

export const markCourseCompleted = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (enrollment.completedAt) {
    throw new Error('Course already marked as completed');
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: {
      userId_courseId: { userId, courseId },
    },
    data: {
      completedAt: new Date(),
    },
    include: {
      course: true,
    },
  });

  return updatedEnrollment;
};

// ===================================
// Unenroll User
// ===================================

export const unenrollUser = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (!enrollment) {
    return null;
  }

  await prisma.enrollment.delete({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  return { deleted: true, userId, courseId };
};
