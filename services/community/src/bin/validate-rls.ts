/**
 * RLS Validation CLI
 * Validates RLS policies across all schemas
 */

import { PrismaClient } from '@prisma/client';

async function validateRLS() {
  const prisma = new PrismaClient();

  console.log('\n🔐 RLS VALIDATION - Starting...\n');
  console.log('='.repeat(80));

  const schemas = ['community', 'marketplace', 'academy', 'business'];

  try {
    for (const schema of schemas) {
      console.log(`\n📊 Validating ${schema.toUpperCase()} schema...\n`);

      try {
        // Get all tables
        const tables = await prisma.$queryRaw<
          Array<{ tablename: string; rowsecurity: boolean }>
        >`
          SELECT tablename, rowsecurity
          FROM pg_tables
          WHERE schemaname = ${schema}
          ORDER BY tablename
        `;

        let protected_count = 0;
        let partial_count = 0;
        let unprotected_count = 0;

        for (const table of tables) {
          const policies = await prisma.$queryRaw<Array<{ policyname: string }>>`
            SELECT policyname
            FROM pg_policies
            WHERE schemaname = ${schema}
            AND tablename = ${table.tablename}
            ORDER BY policyname
          `;

          const policyCount = policies.length;
          let status = 'UNPROTECTED';

          if (table.rowsecurity && policyCount >= 2) {
            status = 'PROTECTED';
            protected_count++;
          } else if (table.rowsecurity && policyCount === 1) {
            status = 'PARTIAL';
            partial_count++;
          } else {
            unprotected_count++;
          }

          const statusIcon =
            status === 'PROTECTED' ? '🟢' : status === 'PARTIAL' ? '🟡' : '🔴';

          console.log(
            `  ${statusIcon} ${table.tablename.padEnd(25)} RLS: ${table.rowsecurity ? '✅' : '❌'} | Policies: ${policyCount}`
          );

          if (policyCount > 0) {
            const policyNames = policies.map((p: { policyname: string }) => p.policyname).join(', ');
            console.log(`     └─ Policies: ${policyNames}`);
          }
        }

        console.log(
          `\n  Summary: ${protected_count} PROTECTED | ${partial_count} PARTIAL | ${unprotected_count} UNPROTECTED\n`
        );
      } catch (error) {
        console.error(`  ❌ Error validating ${schema}:`, error);
      }
    }

    console.log('='.repeat(80));
    console.log('\n✅ RLS Validation Complete\n');
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateRLS().catch(console.error);
