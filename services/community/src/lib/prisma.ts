import { PrismaClient } from '../../node_modules/.prisma-community/client';

const prisma = new PrismaClient();

export { PrismaClient };
export default prisma;
