/**
 * Quick validation runner for logger testing
 */
import { validateLogger } from './logger.validation';

async function runValidation() {
  try {
    const report = await validateLogger('marketplace');
    process.exit(report.summary.percentage === 100 ? 0 : 1);
  } catch (error) {
    console.error('Validation error:', error);
    process.exit(1);
  }
}

runValidation();
