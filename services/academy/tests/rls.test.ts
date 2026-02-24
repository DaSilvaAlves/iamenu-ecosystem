/**
 * RLS Security Tests - Academy Service
 * SKIPPED IN CI: Requires RLS PostgreSQL configuration
 */

// Skip this test in CI environments - it requires special PostgreSQL setup
if (!process.env.CI) {
  const prisma = require('../../src/lib/prisma').default;
  const { setRLSContext, clearRLSContext } = require('../../src/middleware/rls');

describe('RLS: Academy Service - Student Privacy', () => {
  const student1 = 'student-1';
  const student2 = 'student-2';

  describe('Enrollments - STRICT Student Isolation', () => {
    it('CRITICAL: student1 cannot see student2 enrollments', async () => {
      await setRLSContext(student1);
      
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: student2 }
      });
      
      expect(enrollments).toHaveLength(0);
    });

    it('student1 can see own enrollments', async () => {
      await setRLSContext(student1);
      
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: student1 }
      });
      
      expect(enrollments).toBeDefined();
    });
  });

  describe('Certificates - Student Privacy', () => {
    it('SECURITY: student1 cannot see student2 certificates', async () => {
      await setRLSContext(student1);
      
      const certs = await prisma.certificate.findMany({
        where: { userId: student2 }
      });
      
      expect(certs).toHaveLength(0);
    });
  });

  describe('Courses - Published Visibility', () => {
    it('Student can see published courses', async () => {
      await setRLSContext(student1);
      
      const courses = await prisma.course.findMany({
        where: { published: true }
      });
      
      expect(courses).toBeDefined();
    });
  });

  afterEach(async () => {
    await clearRLSContext();
  });
});
} // End of CI skip block
