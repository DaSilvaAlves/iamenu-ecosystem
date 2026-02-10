/**
 * Jest Configuration for API Testing Suite
 * Testes de integração para todas as APIs
 */

module.exports = {
  displayName: 'api-tests',
  testEnvironment: 'node',
  rootDir: 'tests/api',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '**/*.test.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageDirectory: '<rootDir>/../../coverage/api',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json'],
  setupFiles: ['<rootDir>/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  bail: false,
  maxWorkers: '50%',

  // Globals
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
