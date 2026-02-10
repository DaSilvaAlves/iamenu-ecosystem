require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

prisma.$executeRawUnsafe(`
  DELETE FROM "_prisma_migrations" 
  WHERE migration_name = '20260210_convert_float_to_decimal'
`).then(() => {
  console.log('✅ Registo falhado deletado');
  prisma.$disconnect();
}).catch(e => console.error('❌ Erro:', e.message));
