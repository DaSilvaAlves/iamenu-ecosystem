require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

prisma.$executeRawUnsafe(`
  DELETE FROM "_prisma_migrations" 
  WHERE migration_name = '20260210_enable_rls_policies'
`).then(() => {
  console.log('✅ Migration falhada removida');
  prisma.$disconnect();
});
