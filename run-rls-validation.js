/**
 * RLS Validation Runner
 * Executes RLS validator and generates compliance report
 */

const { PrismaClient } = require('@prisma/client');

async function runRLSValidation() {
  const prisma = new PrismaClient();

  console.log('\n🔐 RLS VALIDATION - Starting...\n');
  console.log('='.repeat(80));

  const schemas = ['community', 'marketplace', 'academy', 'business'];
  const validationResults = new Map();

  try {
    for (const schema of schemas) {
      console.log(`\n📊 Validating ${schema.toUpperCase()} schema...\n`);

      try {
        // Get all tables in schema with RLS status
        const tables = await prisma.$queryRaw`
          SELECT tablename, rowsecurity
          FROM pg_tables
          WHERE schemaname = ${schema}
          ORDER BY tablename
        `;

        let protected_count = 0;
        let partial_count = 0;
        let unprotected_count = 0;

        const schemaResults = [];

        for (const table of tables) {
          // Get policies for this table
          const policies = await prisma.$queryRaw`
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
            const policyNames = policies.map((p) => p.policyname).join(', ');
            console.log(`     └─ ${policyNames}`);
          }

          schemaResults.push({
            table: table.tablename,
            rlsEnabled: table.rowsecurity,
            policyCount,
            policies: policies.map((p) => p.policyname),
            status,
          });
        }

        validationResults.set(schema, {
          results: schemaResults,
          summary: {
            protected: protected_count,
            partial: partial_count,
            unprotected: unprotected_count,
            total: schemaResults.length,
          },
        });

        console.log(
          `\n  Summary: ${protected_count} PROTECTED | ${partial_count} PARTIAL | ${unprotected_count} UNPROTECTED\n`
        );
      } catch (error) {
        console.error(`  ❌ Error validating ${schema}:`, error.message);
      }
    }

    // Generate overall report
    console.log('='.repeat(80));
    console.log('\n📋 OVERALL RLS COMPLIANCE REPORT\n');

    let totalProtected = 0;
    let totalPartial = 0;
    let totalUnprotected = 0;
    let totalTables = 0;

    for (const [schema, data] of validationResults) {
      const { summary } = data;
      totalProtected += summary.protected;
      totalPartial += summary.partial;
      totalUnprotected += summary.unprotected;
      totalTables += summary.total;

      const compliance = Math.round(
        ((summary.protected / summary.total) * 100) || 0
      );
      const complianceIcon = compliance === 100 ? '✅' : '⚠️';

      console.log(
        `${complianceIcon} ${schema.toUpperCase().padEnd(12)} | Protected: ${summary.protected}/${summary.total} (${compliance}%) | Partial: ${summary.partial} | Unprotected: ${summary.unprotected}`
      );
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n🎯 TOTAL COMPLIANCE: ${totalProtected}/${totalTables} tables fully protected (${Math.round((totalProtected / totalTables) * 100)}%)\n`);

    // Status assessment
    if (totalUnprotected === 0 && totalPartial <= 2) {
      console.log('✅ STATUS: EXCELLENT - RLS properly configured\n');
    } else if (totalUnprotected <= 2) {
      console.log('⚠️  STATUS: GOOD - Minor issues detected, review needed\n');
    } else {
      console.log('❌ STATUS: CRITICAL - Multiple tables without RLS protection\n');
    }

    // Recommendations
    console.log('📌 RECOMMENDATIONS:\n');
    if (totalUnprotected > 0) {
      console.log(`1. ⚠️  Enable RLS on ${totalUnprotected} unprotected table(s)`);
    }
    if (totalPartial > 0) {
      console.log(`2. ⚠️  Add policies to ${totalPartial} partially protected table(s)`);
    }
    console.log('3. ✅ Run integration tests to validate RLS enforcement');
    console.log('4. ✅ Execute CodeRabbit security review');
    console.log('5. ✅ Document RLS policies in rls-policy-overview.md');

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ RLS Validation Complete\n');

    // Generate JSON report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTables,
        protected: totalProtected,
        partial: totalPartial,
        unprotected: totalUnprotected,
        compliancePercentage: Math.round((totalProtected / totalTables) * 100),
      },
      schemas: Object.fromEntries(validationResults),
    };

    console.log('📊 Full report saved to: rls-validation-report.json');

    // Save report
    const fs = require('fs');
    fs.writeFileSync(
      'rls-validation-report.json',
      JSON.stringify(reportData, null, 2)
    );
  } catch (error) {
    console.error('❌ Validation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runRLSValidation().catch(console.error);
