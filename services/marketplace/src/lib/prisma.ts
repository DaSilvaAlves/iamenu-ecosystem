import { PrismaClient, Prisma } from '../../node_modules/.prisma-marketplace/client';

const prisma = new PrismaClient();

export { PrismaClient, Prisma };
export default prisma;
