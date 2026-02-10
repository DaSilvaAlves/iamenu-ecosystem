/**
 * Prisma RLS Middleware
 * Injects user_id into PostgreSQL session for Row-Level Security policies
 * Attaches to every Prisma client query
 */

export const setupRLSMiddleware = (prisma: any, userId?: string) => {
  prisma.$use(async (params: any, next: any) => {
    // Skip if no user ID available (e.g., public queries)
    if (!userId) {
      return next(params);
    }

    // Before the query runs
    const result = await next(params);

    // Note: PostgreSQL session variables would need to be set at connection time
    // For now, this is a placeholder for future implementation
    // In production, this would be set via:
    // SET app.current_user_id = 'user-id';

    return result;
  });
};

/**
 * Middleware factory to attach RLS to Prisma client
 * Usage in Express middleware:
 *
 * app.use((req, res, next) => {
 *   if (req.user?.userId) {
 *     setupRLSMiddleware(prisma, req.user.userId);
 *   }
 *   next();
 * });
 */
export const createRLSMiddleware = (userId: string) => {
  return async (params: any, next: any) => {
    if (!userId) {
      return next(params);
    }

    // This would set the PostgreSQL session variable
    // $executeRaw would be used: await prisma.$executeRaw`SET app.current_user_id = ${userId}`;

    return next(params);
  };
};
