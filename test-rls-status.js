const { PrismaClient } = require('@prisma/client');

async function checkRLSStatus() {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.$queryRaw`
      SELECT schemaname, tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname IN ('community', 'marketplace', 'academy', 'business')
      ORDER BY schemaname, tablename;
    `;

    console.log('=== RLS STATUS ACROSS ALL SCHEMAS ===\n');
    const schemas = {};

    result.forEach(row => {
      if (!schemas[row.schemaname]) {
        schemas[row.schemaname] = { enabled: 0, disabled: 0 };
      }
      if (row.rowsecurity) {
        schemas[row.schemaname].enabled++;
      } else {
        schemas[row.schemaname].disabled++;
      }
    });

    Object.entries(schemas).forEach(([schema, counts]) => {
      console.log(`📊 ${schema.toUpperCase()}`);
      console.log(`   ✅ RLS Enabled: ${counts.enabled} tables`);
      console.log(`   ❌ RLS Disabled: ${counts.disabled} tables`);
      console.log();
    });

  } catch (error) {
    console.error('Error checking RLS status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRLSStatus();
