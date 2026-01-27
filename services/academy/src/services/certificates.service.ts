import prisma from '../lib/prisma';

// ===================================
// Generate Verification Code
// ===================================

const generateVerificationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ===================================
// Issue Certificate
// ===================================

export const issueCertificate = async (userId: string, courseId: string) => {
  // Check if enrollment exists and is completed
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (!enrollment) {
    throw new Error('User is not enrolled in this course');
  }

  if (!enrollment.completedAt) {
    throw new Error('Course must be completed before issuing certificate');
  }

  // Check if certificate already exists
  const existingCertificate = await prisma.certificate.findFirst({
    where: { userId, courseId },
  });

  if (existingCertificate) {
    return existingCertificate;
  }

  // Generate unique verification code
  let verificationCode = generateVerificationCode();
  let attempts = 0;

  while (attempts < 10) {
    const existing = await prisma.certificate.findUnique({
      where: { verificationCode },
    });
    if (!existing) break;
    verificationCode = generateVerificationCode();
    attempts++;
  }

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      verificationCode,
    },
  });

  return certificate;
};

// ===================================
// Get User Certificates
// ===================================

export const getUserCertificates = async (userId: string) => {
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
  });

  // Get course details for each certificate
  const certificatesWithCourses = await Promise.all(
    certificates.map(async (cert) => {
      const course = await prisma.course.findUnique({
        where: { id: cert.courseId },
        select: { title: true, category: true, level: true },
      });
      return { ...cert, course };
    })
  );

  return certificatesWithCourses;
};

// ===================================
// Verify Certificate
// ===================================

export const verifyCertificate = async (verificationCode: string) => {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode },
  });

  if (!certificate) {
    return null;
  }

  // Get course details
  const course = await prisma.course.findUnique({
    where: { id: certificate.courseId },
    select: { title: true, category: true, level: true, durationMinutes: true },
  });

  return {
    valid: true,
    certificate: {
      ...certificate,
      course,
    },
  };
};

// ===================================
// Get Certificate by ID
// ===================================

export const getCertificateById = async (id: string) => {
  const certificate = await prisma.certificate.findUnique({
    where: { id },
  });

  if (!certificate) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: { id: certificate.courseId },
  });

  return { ...certificate, course };
};
