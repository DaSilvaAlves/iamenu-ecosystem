const { execSync } = require('child_process');
const fs = require('fs');

try {
  // 1. Ler variáveis de ambiente
  require('dotenv').config({ path: '../../.env' });
  
  const dbUrl = process.env.DATABASE_URL;
  console.log('🔄 Resetando status de migrations no banco de dados...');
  
  // 2. Conectar e deletar registos falhados
  const { PrismaClient } = require('./generated/prisma');
  const prisma = new PrismaClient();
  
  prisma.$executeRawUnsafe(`
    DELETE FROM "_prisma_migrations" 
    WHERE migration_name LIKE '20260210%' 
    AND finished_at IS NULL
  `).then(() => {
    console.log('✅ Migrations falhadas deletadas');
    prisma.$disconnect();
  });
} catch (e) {
  console.error('❌ Erro:', e.message);
}
