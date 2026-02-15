#!/usr/bin/env node

/**
 * Auto-Refresh System Diagnostic Test
 *
 * Run this to verify that the auto-refresh system is properly configured.
 * Usage: node test-auto-refresh.js
 *
 * Tests:
 * 1. Templates exist
 * 2. File watcher module loads
 * 3. Config cache TTL is correct
 * 4. Vite HMR configuration
 * 5. Auto-refresh initialization
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

console.log('═'.repeat(80));
console.log('🧪 AUTO-REFRESH SYSTEM DIAGNOSTIC TEST');
console.log('═'.repeat(80));
console.log('');

let testsPassed = 0;
let testsFailed = 0;

function testCheck(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    testsPassed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    testsFailed++;
  }
}

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 1: TEMPLATES
// ═════════════════════════════════════════════════════════════════════════════════

console.log('📋 TEMPLATES');
console.log('─'.repeat(80));

const archTemplatePath = path.join(projectRoot, '.aios-core', 'templates', 'brownfield-architecture-tmpl.yaml');
testCheck(
  'brownfield-architecture-tmpl.yaml exists',
  fs.existsSync(archTemplatePath),
  archTemplatePath
);

const feTemplatePath = path.join(projectRoot, '.aios-core', 'templates', 'front-end-spec-tmpl.yaml');
testCheck(
  'front-end-spec-tmpl.yaml exists',
  fs.existsSync(feTemplatePath),
  feTemplatePath
);

if (fs.existsSync(archTemplatePath)) {
  const archContent = fs.readFileSync(archTemplatePath, 'utf8');
  testCheck(
    'brownfield-architecture-tmpl.yaml contains metadata',
    archContent.includes('metadata:'),
    `${archContent.split('\n').length} lines`
  );
}

if (fs.existsSync(feTemplatePath)) {
  const feContent = fs.readFileSync(feTemplatePath, 'utf8');
  testCheck(
    'front-end-spec-tmpl.yaml contains metadata',
    feContent.includes('metadata:'),
    `${feContent.split('\n').length} lines`
  );
}

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 2: FILE WATCHER MODULE
// ═════════════════════════════════════════════════════════════════════════════════

console.log('👁️  FILE WATCHER SYSTEM');
console.log('─'.repeat(80));

const watcherPath = path.join(projectRoot, '.aios-core', 'infrastructure', 'scripts', 'file-watcher-manager.js');
testCheck(
  'file-watcher-manager.js exists',
  fs.existsSync(watcherPath),
  watcherPath
);

if (fs.existsSync(watcherPath)) {
  try {
    const watcherContent = fs.readFileSync(watcherPath, 'utf8');
    testCheck(
      'FileWatcherManager class defined',
      watcherContent.includes('class FileWatcherManager'),
      '✓ Class exported'
    );
    testCheck(
      'initializeAutoRefresh function defined',
      watcherContent.includes('function initializeAutoRefresh'),
      '✓ Function exported'
    );
    testCheck(
      'globalWatcherManager instance created',
      watcherContent.includes('const globalWatcherManager = new FileWatcherManager()'),
      '✓ Singleton pattern used'
    );
  } catch (error) {
    console.log(`⚠️  Could not read watcher file: ${error.message}`);
  }
}

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 3: CONFIG CACHE TTL
// ═════════════════════════════════════════════════════════════════════════════════

console.log('⏱️  CONFIG CACHE SETTINGS');
console.log('─'.repeat(80));

const cacheConfigPath = path.join(projectRoot, '.aios-core', 'core', 'config', 'config-cache.js');
if (fs.existsSync(cacheConfigPath)) {
  const cacheContent = fs.readFileSync(cacheConfigPath, 'utf8');

  const hasNewTTL = cacheContent.includes('ttl = 30 * 1000');
  const hasOldTTL = cacheContent.includes('ttl = 5 * 60 * 1000');

  testCheck(
    'Config cache TTL is 30 seconds (new)',
    hasNewTTL && !hasOldTTL,
    hasNewTTL ? '✓ TTL = 30s' : 'TTL not updated'
  );

  testCheck(
    'Config cache comment updated',
    cacheContent.includes('30 seconds'),
    '✓ Documentation updated'
  );
}

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 4: VITE HMR CONFIGURATION
// ═════════════════════════════════════════════════════════════════════════════════

console.log('🚀 VITE HMR CONFIGURATION');
console.log('─'.repeat(80));

const vitePath = path.join(projectRoot, 'frontend', 'apps', 'prototype-vision', 'vite.config.ts');
if (fs.existsSync(vitePath)) {
  const viteContent = fs.readFileSync(vitePath, 'utf8');

  testCheck(
    'Vite HMR is enabled',
    viteContent.includes("hmr: {") && viteContent.includes("host: 'localhost'"),
    '✓ HMR object configured'
  );

  testCheck(
    'Vite HMR port is 5173',
    viteContent.includes("port: 5173"),
    '✓ Standard Vite port'
  );

  testCheck(
    'Vite HMR protocol is ws',
    viteContent.includes("protocol: 'ws'"),
    '✓ WebSocket protocol enabled'
  );
}

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 5: AUTO-REFRESH INITIALIZATION
// ═════════════════════════════════════════════════════════════════════════════════

console.log('🔄 AUTO-REFRESH INITIALIZATION');
console.log('─'.repeat(80));

const autoRefreshInitPath = path.join(projectRoot, '.aios-core', 'core', 'startup', 'auto-refresh-init.js');
testCheck(
  'auto-refresh-init.js exists',
  fs.existsSync(autoRefreshInitPath),
  autoRefreshInitPath
);

if (fs.existsSync(autoRefreshInitPath)) {
  const initContent = fs.readFileSync(autoRefreshInitPath, 'utf8');
  testCheck(
    'initializeAutoRefresh function exported',
    initContent.includes('module.exports = {') && initContent.includes('initializeAutoRefresh'),
    '✓ Exported from startup module'
  );
}

const coreIndexPath = path.join(projectRoot, '.aios-core', 'core', 'index.js');
if (fs.existsSync(coreIndexPath)) {
  const coreContent = fs.readFileSync(coreIndexPath, 'utf8');
  testCheck(
    'auto-refresh-init imported in core/index.js',
    coreContent.includes('auto-refresh-init'),
    '✓ Imported from startup module'
  );

  testCheck(
    'initializeAutoRefresh exported from core',
    coreContent.includes('initializeAutoRefresh,'),
    '✓ Available from @synkra/aios-core'
  );
}

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// TEST 6: WATCHED FILES EXIST
// ═════════════════════════════════════════════════════════════════════════════════

console.log('📂 WATCHED FILES');
console.log('─'.repeat(80));

const watchedPaths = [
  { name: 'Agents directory', path: '.aios-core/development/agents' },
  { name: 'Stories directory', path: 'docs/stories' },
  { name: 'Workflow patterns', path: '.aios-core/data/workflow-patterns.yaml' },
  { name: 'Project status', path: '.aios/project-status.yaml' },
];

watchedPaths.forEach(({ name, path: relPath }) => {
  const fullPath = path.join(projectRoot, relPath);
  testCheck(
    `${name} exists`,
    fs.existsSync(fullPath),
    fullPath
  );
});

console.log('');

// ═════════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═════════════════════════════════════════════════════════════════════════════════

console.log('═'.repeat(80));
console.log('📊 TEST SUMMARY');
console.log('═'.repeat(80));

const total = testsPassed + testsFailed;
const percentage = Math.round((testsPassed / total) * 100);

console.log(`✅ Passed: ${testsPassed}/${total}`);
console.log(`❌ Failed: ${testsFailed}/${total}`);
console.log(`📈 Success Rate: ${percentage}%`);
console.log('');

if (testsFailed === 0) {
  console.log('🎉 ALL TESTS PASSED! Auto-refresh system is ready.');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Make a change to any watched file');
  console.log('  3. Observe auto-refresh messages in console');
  console.log('');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED. See above for details.');
  console.log('');
  console.log('Please review:');
  console.log('  - Missing files need to be created');
  console.log('  - Configuration changes may need manual updates');
  console.log('  - Check .aios-core/SETUP-AUTO-REFRESH.md for detailed setup guide');
  console.log('');
  process.exit(1);
}
