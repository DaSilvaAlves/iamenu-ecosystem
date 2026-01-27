import prisma from '../lib/prisma';

// ===================================
// Get All Courses
// ===================================

interface GetCoursesParams {
  category?: string;
  level?: string;
  published?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export const getCourses = async (params: GetCoursesParams) => {
  const { category, level, published = true, search, limit = 20, offset = 0 } = params;

  const where: any = {};

  if (published !== undefined) {
    where.published = published;
  }

  if (category) {
    where.category = category;
  }

  if (level) {
    where.level = level;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { modules: true, enrollments: true },
      },
    },
  });

  const total = await prisma.course.count({ where });

  return { courses, total, limit, offset };
};

// ===================================
// Get Course by ID or Slug
// ===================================

export const getCourseById = async (idOrSlug: string) => {
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug },
      ],
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  return course;
};

// ===================================
// Create Course
// ===================================

interface CreateCourseData {
  title: string;
  slug: string;
  category: string;
  level: string;
  durationMinutes: number;
  price?: number;
  published?: boolean;
}

export const createCourse = async (data: CreateCourseData) => {
  // Check if slug already exists
  const existingCourse = await prisma.course.findUnique({
    where: { slug: data.slug },
  });

  if (existingCourse) {
    throw new Error('Course with this slug already exists');
  }

  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug: data.slug,
      category: data.category,
      level: data.level,
      durationMinutes: data.durationMinutes,
      price: data.price || 0,
      published: data.published || false,
    },
  });

  return course;
};

// ===================================
// Update Course
// ===================================

export const updateCourse = async (id: string, data: Partial<CreateCourseData>) => {
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    return null;
  }

  // If slug is being changed, check for conflicts
  if (data.slug && data.slug !== existingCourse.slug) {
    const slugConflict = await prisma.course.findUnique({
      where: { slug: data.slug },
    });
    if (slugConflict) {
      throw new Error('Course with this slug already exists');
    }
  }

  const course = await prisma.course.update({
    where: { id },
    data,
  });

  return course;
};

// ===================================
// Delete Course
// ===================================

export const deleteCourse = async (id: string) => {
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    return null;
  }

  await prisma.course.delete({
    where: { id },
  });

  return { deleted: true, courseId: id };
};

// ===================================
// Add Module to Course
// ===================================

interface CreateModuleData {
  courseId: string;
  title: string;
  order: number;
}

export const addModule = async (data: CreateModuleData) => {
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const module = await prisma.module.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      order: data.order,
    },
    include: {
      lessons: true,
    },
  });

  return module;
};

// ===================================
// Add Lesson to Module
// ===================================

interface CreateLessonData {
  moduleId: string;
  title: string;
  videoUrl?: string;
  order: number;
}

export const addLesson = async (data: CreateLessonData) => {
  const module = await prisma.module.findUnique({
    where: { id: data.moduleId },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: data.moduleId,
      title: data.title,
      videoUrl: data.videoUrl || null,
      order: data.order,
    },
  });

  return lesson;
};

// ===================================
// Get Categories
// ===================================

export const getCategories = async () => {
  const categories = await prisma.course.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category'],
  });

  return categories.map((c) => c.category);
};
