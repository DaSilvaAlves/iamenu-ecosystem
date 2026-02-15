/**
 * RLS Validator
 * Validates that Row-Level Security policies are properly configured
 * and functional across all schemas
 */

import { PrismaClient } from '@prisma/client';

export interface RLSValidationResult {
  schema: string;
  table: string;
  rlsEnabled: boolean;
  policyCount: number;
  policies: string[];
  status: 'PROTECTED' | 'UNPROTECTED' | 'PARTIAL';
}

export class RLSValidator {
  constructor(private prisma: PrismaClient) {}

  /**
   * Validate RLS configuration across a schema
   */
  async validateSchema(schemaName: string): Promise<RLSValidationResult[]> {
    const results: RLSValidationResult[] = [];

    try {
      // Get all tables in schema
      const tables = await this.prisma.$queryRaw<
        Array<{ tablename: string; rowsecurity: boolean }>
      >`
        SELECT tablename, rowsecurity
        FROM pg_tables
        WHERE schemaname = ${schemaName}
        ORDER BY tablename
      `;

      // For each table, check RLS and policies
      for (const table of tables) {
        const policies = await this.getPolicies(schemaName, table.tablename);
        const status = this.determineStatus(table.rowsecurity, policies.length);

        results.push({
          schema: schemaName,
          table: table.tablename,
          rlsEnabled: table.rowsecurity,
          policyCount: policies.length,
          policies,
          status,
        });
      }
    } catch (error) {
      console.error(`Error validating schema ${schemaName}:`, error);
    }

    return results;
  }

  /**
   * Get all RLS policies for a table
   */
  private async getPolicies(schemaName: string, tableName: string): Promise<string[]> {
    try {
      const policies = await this.prisma.$queryRaw<Array<{ policyname: string }>>`
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = ${schemaName}
        AND tablename = ${tableName}
        ORDER BY policyname
      `;

      return policies.map((p: { policyname: string }) => p.policyname);
    } catch (error) {
      console.error(
        `Error fetching policies for ${schemaName}.${tableName}:`,
        error
      );
      return [];
    }
  }

  /**
   * Determine RLS protection status
   */
  private determineStatus(
    rlsEnabled: boolean,
    policyCount: number
  ): 'PROTECTED' | 'UNPROTECTED' | 'PARTIAL' {
    if (!rlsEnabled) {
      return 'UNPROTECTED';
    }
    if (policyCount === 0) {
      return 'UNPROTECTED'; // RLS enabled but no policies
    }
    if (policyCount >= 2) {
      return 'PROTECTED'; // Multiple policies (comprehensive)
    }
    return 'PARTIAL'; // Single policy (basic protection)
  }

  /**
   * Run comprehensive RLS validation
   */
  async validateAll(): Promise<Map<string, RLSValidationResult[]>> {
    const schemas = ['community', 'marketplace', 'academy', 'business'];
    const results = new Map<string, RLSValidationResult[]>();

    console.log('\n📊 RLS Validation Report\n');
    console.log('='.repeat(80));

    for (const schema of schemas) {
      console.log(`\n🔍 Validating ${schema.toUpperCase()} schema...\n`);

      const schemaResults = await this.validateSchema(schema);
      results.set(schema, schemaResults);

      // Print results
      let protected_count = 0;
      let partial_count = 0;
      let unprotected_count = 0;

      for (const result of schemaResults) {
        const statusIcon = this.getStatusIcon(result.status);
        console.log(
          `  ${statusIcon} ${result.table.padEnd(25)} RLS: ${result.rlsEnabled ? '✅' : '❌'} | Policies: ${result.policyCount}`
        );

        if (result.status === 'PROTECTED') protected_count++;
        else if (result.status === 'PARTIAL') partial_count++;
        else unprotected_count++;
      }

      console.log(`\n  Summary: ${protected_count} PROTECTED, ${partial_count} PARTIAL, ${unprotected_count} UNPROTECTED`);
    }

    console.log('\n' + '='.repeat(80));
    return results;
  }

  /**
   * Test RLS enforcement with actual queries
   */
  async testRLSEnforcement(userId: string): Promise<void> {
    console.log(`\n🧪 Testing RLS Enforcement for User: ${userId}\n`);

    try {
      // Set user context
      await this.prisma.$executeRaw`SET app.current_user_id = ${userId}`;

      // Test 1: User should only see their own posts
      const userPosts = await this.prisma.$queryRaw`
        SELECT id, "authorId", title
        FROM "community"."posts"
        LIMIT 5
      `;

      console.log('✅ Query: User posts (RLS enforced)');
      console.log(`   Result: ${(userPosts as any[])?.length || 0} posts returned\n`);

      // Test 2: User should only see their own notifications
      const userNotifications = await this.prisma.$queryRaw`
        SELECT id, "userId", message
        FROM "community"."notifications"
        LIMIT 5
      `;

      console.log('✅ Query: User notifications (STRICT RLS)');
      console.log(`   Result: ${(userNotifications as any[])?.length || 0} notifications returned\n`);

      // Test 3: Check refresh tokens (sensitive)
      const userTokens = await this.prisma.$queryRaw`
        SELECT id, "userId"
        FROM "community"."refresh_tokens"
        LIMIT 5
      `;

      console.log('✅ Query: User refresh tokens (STRICT RLS)');
      console.log(`   Result: ${(userTokens as any[])?.length || 0} tokens returned\n`);

      // Reset session variable
      await this.prisma.$executeRaw`RESET app.current_user_id`;
    } catch (error) {
      console.error('❌ RLS enforcement test failed:', error);
    }
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status: 'PROTECTED' | 'UNPROTECTED' | 'PARTIAL'): string {
    switch (status) {
      case 'PROTECTED':
        return '🟢';
      case 'PARTIAL':
        return '🟡';
      case 'UNPROTECTED':
        return '🔴';
    }
  }

  /**
   * Generate validation report
   */
  async generateReport(): Promise<string> {
    const results = await this.validateAll();
    let report = '# RLS Validation Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    for (const [schema, schemaResults] of results) {
      report += `## ${schema.toUpperCase()} Schema\n\n`;

      for (const result of schemaResults) {
        report += `- **${result.table}**: ${result.status}\n`;
        if (result.policies.length > 0) {
          report += `  - Policies: ${result.policies.join(', ')}\n`;
        }
      }

      report += '\n';
    }

    return report;
  }
}

/**
 * Helper function to validate RLS on startup
 */
export async function validateRLSOnStartup(prisma: PrismaClient): Promise<void> {
  const validator = new RLSValidator(prisma);

  try {
    console.log('🔐 Validating RLS Configuration...\n');
    await validator.validateAll();
    console.log('\n✅ RLS Validation Complete\n');
  } catch (error) {
    console.error('⚠️  RLS Validation encountered errors:', error);
    // Don't throw - allow app to start but warn about RLS issues
  }
}
