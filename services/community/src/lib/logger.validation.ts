/**
 * Logger Validation Test Suite
 *
 * Validates that:
 * - Logs are written to files
 * - Request IDs are included in logs
 * - Log format is consistent
 * - Sensitive data is redacted
 * - Log rotation works
 * - Performance impact is acceptable
 */

import fs from 'fs';
import path from 'path';
import logger from './logger';
import { redactSensitiveData } from './redact';

interface ValidationResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: string;
  service: string;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    percentage: number;
  };
}

/**
 * Validation Test Suite
 */
export class LoggerValidation {
  private serviceName: string;
  private logsDir: string;
  private results: ValidationResult[] = [];

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logsDir = path.join(process.cwd(), 'logs');
  }

  /**
   * Run all validation tests
   */
  async runAllTests(): Promise<ValidationReport> {
    console.log(`\n📋 Starting Logger Validation for ${this.serviceName} Service\n`);

    // Run tests
    await this.testLogsDirectoryExists();
    await this.testLogFilesCreated();
    await this.testLogFormatConsistency();
    await this.testRequestIdPresent();
    await this.testSensitiveDataRedaction();
    await this.testLogRotation();
    await this.testPerformanceImpact();

    // Generate report
    return this.generateReport();
  }

  /**
   * Test 1: Verify logs directory exists
   */
  private async testLogsDirectoryExists(): Promise<void> {
    try {
      const exists = fs.existsSync(this.logsDir);
      this.addResult({
        name: '1. Logs Directory Exists',
        passed: exists,
        message: exists
          ? `✅ Logs directory found at: ${this.logsDir}`
          : `❌ Logs directory not found at: ${this.logsDir}`,
        details: { path: this.logsDir }
      });
    } catch (error) {
      this.addResult({
        name: '1. Logs Directory Exists',
        passed: false,
        message: `❌ Error checking logs directory: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 2: Verify log files are created
   */
  private async testLogFilesCreated(): Promise<void> {
    try {
      logger.info('Validation test - checking if logs are created', {
        testId: 'log-file-creation'
      });

      // Wait a moment for file to be written
      await new Promise(resolve => setTimeout(resolve, 100));

      const files = fs.readdirSync(this.logsDir);
      const expectedFiles = ['app.log', 'error.log'];
      const foundFiles = files.filter(f => expectedFiles.includes(f));

      const passed = foundFiles.length >= 1;
      this.addResult({
        name: '2. Log Files Created',
        passed,
        message: passed
          ? `✅ Log files created: ${foundFiles.join(', ')}`
          : `❌ Expected log files not found. Found: ${files.join(', ')}`,
        details: { expectedFiles, foundFiles }
      });
    } catch (error) {
      this.addResult({
        name: '2. Log Files Created',
        passed: false,
        message: `❌ Error checking log files: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 3: Verify log format consistency
   */
  private async testLogFormatConsistency(): Promise<void> {
    try {
      const appLogPath = path.join(this.logsDir, 'app.log');

      if (!fs.existsSync(appLogPath)) {
        this.addResult({
          name: '3. Log Format Consistency',
          passed: false,
          message: '❌ App log file not found',
        });
        return;
      }

      const content = fs.readFileSync(appLogPath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());

      // Check if logs are valid JSON
      let validJsonCount = 0;
      const jsonObjects: any[] = [];

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          validJsonCount++;
          jsonObjects.push(json);
        } catch (e) {
          // Not JSON or invalid
        }
      }

      // Verify structure of parsed logs
      const structureValid = jsonObjects.every(obj =>
        obj.timestamp &&
        obj.level &&
        obj.service &&
        obj.message
      );

      const passed = validJsonCount > 0 && structureValid;
      this.addResult({
        name: '3. Log Format Consistency',
        passed,
        message: passed
          ? `✅ Log format valid: ${validJsonCount} properly formatted JSON logs with correct structure`
          : `❌ Log format issues: ${validJsonCount}/${lines.length} logs are valid JSON`,
        details: {
          totalLines: lines.length,
          validJsonCount,
          hasTimestamp: jsonObjects.every(o => o.timestamp),
          hasLevel: jsonObjects.every(o => o.level),
          hasService: jsonObjects.every(o => o.service),
          hasMessage: jsonObjects.every(o => o.message),
          sample: jsonObjects[0]
        }
      });
    } catch (error) {
      this.addResult({
        name: '3. Log Format Consistency',
        passed: false,
        message: `❌ Error validating log format: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 4: Verify request IDs are present
   */
  private async testRequestIdPresent(): Promise<void> {
    try {
      const appLogPath = path.join(this.logsDir, 'app.log');

      if (!fs.existsSync(appLogPath)) {
        this.addResult({
          name: '4. Request ID Present',
          passed: false,
          message: '❌ App log file not found',
        });
        return;
      }

      const content = fs.readFileSync(appLogPath, 'utf-8');
      const lines = content.split('\n').filter(l => l.trim());

      let logsWithRequestId = 0;
      const sampleRequestIds: string[] = [];

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.requestId) {
            logsWithRequestId++;
            if (sampleRequestIds.length < 3) {
              sampleRequestIds.push(json.requestId);
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }

      const passed = logsWithRequestId > 0;
      this.addResult({
        name: '4. Request ID Present',
        passed,
        message: passed
          ? `✅ Request IDs found in logs: ${logsWithRequestId} entries with requestId`
          : `❌ No request IDs found in logs`,
        details: {
          totalLogs: lines.length,
          logsWithRequestId,
          sampleRequestIds
        }
      });
    } catch (error) {
      this.addResult({
        name: '4. Request ID Present',
        passed: false,
        message: `❌ Error checking request IDs: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 5: Verify sensitive data is redacted
   */
  private async testSensitiveDataRedaction(): Promise<void> {
    try {
      // Log test data with sensitive information
      const testData = {
        password: 'secret123',
        token: 'jwt-token-xyz',
        apiKey: 'sk-1234567890'
      };

      logger.info('Validation test - checking redaction', testData);

      // Wait for file write
      await new Promise(resolve => setTimeout(resolve, 100));

      const appLogPath = path.join(this.logsDir, 'app.log');
      const content = fs.readFileSync(appLogPath, 'utf-8');

      // Check if sensitive values are NOT in the log
      const hasSensitiveData =
        content.includes('secret123') ||
        content.includes('jwt-token-xyz') ||
        content.includes('sk-1234567890');

      // Check if redacted markers are present
      const hasRedactionMarkers = content.includes('***REDACTED***');

      const passed = !hasSensitiveData && hasRedactionMarkers;
      this.addResult({
        name: '5. Sensitive Data Redaction',
        passed,
        message: passed
          ? `✅ Sensitive data properly redacted (found redaction markers)`
          : `❌ Sensitive data redaction issues: ${!hasRedactionMarkers ? 'No redaction markers found' : 'Sensitive data visible in logs'}`,
        details: {
          hasSensitiveData,
          hasRedactionMarkers
        }
      });
    } catch (error) {
      this.addResult({
        name: '5. Sensitive Data Redaction',
        passed: false,
        message: `❌ Error testing redaction: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 6: Verify log rotation configuration
   */
  private async testLogRotation(): Promise<void> {
    try {
      const appLogPath = path.join(this.logsDir, 'app.log');

      if (!fs.existsSync(appLogPath)) {
        this.addResult({
          name: '6. Log Rotation Configuration',
          passed: false,
          message: '❌ App log file not found',
        });
        return;
      }

      const stats = fs.statSync(appLogPath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      // Log rotation is configured for 5MB max
      const passed = fileSizeInMB < 5; // File should be less than 5MB if rotation is working

      this.addResult({
        name: '6. Log Rotation Configuration',
        passed,
        message: passed
          ? `✅ Log file size within limits: ${fileSizeInMB.toFixed(2)}MB (max 5MB)`
          : `⚠️ Log file size: ${fileSizeInMB.toFixed(2)}MB (rotation configured for 5MB)`,
        details: {
          fileSizeBytes: stats.size,
          fileSizeMB: fileSizeInMB.toFixed(2),
          maxSizeMB: 5
        }
      });
    } catch (error) {
      this.addResult({
        name: '6. Log Rotation Configuration',
        passed: false,
        message: `❌ Error checking log rotation: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Test 7: Verify performance impact
   */
  private async testPerformanceImpact(): Promise<void> {
    try {
      const iterations = 1000;
      const startTime = process.hrtime.bigint();

      // Log messages to measure performance
      for (let i = 0; i < iterations; i++) {
        logger.info('Performance test message', {
          index: i,
          timestamp: new Date().toISOString()
        });
      }

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;
      const avgMs = durationMs / iterations;
      const logsPerSecond = Math.round(1000 / avgMs);

      // Performance should be < 1ms per log on average
      const passed = avgMs < 1.0;

      this.addResult({
        name: '7. Performance Impact',
        passed,
        message: passed
          ? `✅ Logging performance acceptable: ${avgMs.toFixed(3)}ms per log (${logsPerSecond} logs/sec)`
          : `⚠️ Logging performance: ${avgMs.toFixed(3)}ms per log (${logsPerSecond} logs/sec)`,
        details: {
          iterations,
          totalDurationMs: durationMs.toFixed(2),
          avgTimePerLogMs: avgMs.toFixed(3),
          logsPerSecond
        }
      });
    } catch (error) {
      this.addResult({
        name: '7. Performance Impact',
        passed: false,
        message: `❌ Error testing performance: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  /**
   * Add result to results array
   */
  private addResult(result: ValidationResult): void {
    this.results.push(result);
  }

  /**
   * Generate validation report
   */
  private generateReport(): ValidationReport {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    return {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      results: this.results,
      summary: {
        total,
        passed,
        failed: total - passed,
        percentage: Math.round((passed / total) * 100)
      }
    };
  }

  /**
   * Print report to console
   */
  static printReport(report: ValidationReport): void {
    console.log('\n' + '='.repeat(70));
    console.log(`📊 Logger Validation Report - ${report.service} Service`);
    console.log('='.repeat(70));
    console.log(`\n📅 Timestamp: ${report.timestamp}\n`);

    // Print individual results
    for (const result of report.results) {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   Details:`, result.details);
      }
      console.log();
    }

    // Print summary
    console.log('='.repeat(70));
    console.log(`📈 Summary`);
    console.log('='.repeat(70));
    console.log(`Total Tests:  ${report.summary.total}`);
    console.log(`Passed:       ${report.summary.passed} ✅`);
    console.log(`Failed:       ${report.summary.failed} ${report.summary.failed > 0 ? '❌' : ''}`);
    console.log(`Success Rate: ${report.summary.percentage}%`);
    console.log('='.repeat(70) + '\n');

    // Overall status
    if (report.summary.percentage === 100) {
      console.log('🎉 ALL VALIDATION TESTS PASSED!\n');
    } else if (report.summary.percentage >= 80) {
      console.log('✅ VALIDATION MOSTLY PASSED - Minor warnings\n');
    } else {
      console.log('⚠️  VALIDATION FAILED - Review failures above\n');
    }
  }
}

/**
 * Export for use in tests
 */
export async function validateLogger(serviceName: string): Promise<ValidationReport> {
  const validator = new LoggerValidation(serviceName);
  const report = await validator.runAllTests();
  LoggerValidation.printReport(report);
  return report;
}
