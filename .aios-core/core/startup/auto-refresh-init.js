/**
 * Auto-Refresh System Initialization
 *
 * This module initializes the auto-refresh system on AIOS startup.
 * It sets up file watchers for all critical files and enables cache invalidation.
 *
 * Called from: .aios-core/core/index.js on application startup
 *
 * Part of Solution: AIOS Auto-Update System (2026-02-12)
 */

const path = require('path');
const fs = require('fs');

/**
 * Initialize auto-refresh system
 * Safe to call multiple times - uses singleton pattern
 */
async function initializeAutoRefresh() {
  try {
    // Import the file watcher manager
    const {
      globalWatcherManager,
      initializeAutoRefresh: startWatchers,
    } = require('../infrastructure/scripts/file-watcher-manager');

    // Initialize all file watches
    startWatchers();

    // Log initialization success
    console.log('═'.repeat(80));
    console.log('✅ AUTO-REFRESH SYSTEM INITIALIZED');
    console.log('═'.repeat(80));
    console.log('');
    console.log('🔍 Watching for changes in:');
    console.log('   ✓ Agent files (.aios-core/development/agents/)');
    console.log('   ✓ Prisma schemas (services/*/prisma/schema.prisma)');
    console.log('   ✓ Story files (docs/stories/)');
    console.log('   ✓ Workflow patterns (.aios-core/data/workflow-patterns.yaml)');
    console.log('   ✓ Project status (.aios/project-status.yaml)');
    console.log('');
    console.log('🔄 Auto-actions enabled:');
    console.log('   ✓ Agent changes → IDE sync');
    console.log('   ✓ Schema changes → Prisma client regeneration');
    console.log('   ✓ Story changes → Workflow navigator refresh');
    console.log('   ✓ Config changes → Cache invalidation (30s TTL)');
    console.log('');
    console.log('💡 Frontend HMR enabled:');
    console.log('   ✓ React component changes reload instantly');
    console.log('   ✓ CSS/JS changes reflect immediately');
    console.log('');
    console.log('═'.repeat(80));
    console.log('');

    return true;

  } catch (error) {
    // Non-blocking: auto-refresh is optional
    console.warn('⚠️  Auto-refresh system initialization warning:', error.message);
    console.warn('   The system will continue to work, but you may need to manually refresh files.');
    return false;
  }
}

/**
 * Get auto-refresh status
 * Useful for debugging and monitoring
 */
function getAutoRefreshStatus() {
  try {
    const { globalWatcherManager } = require('../infrastructure/scripts/file-watcher-manager');
    const watched = globalWatcherManager.getWatched();

    return {
      enabled: true,
      watchCount: watched.length,
      watches: watched.map(w => ({
        id: w.id,
        path: w.path,
        lastModified: new Date(w.stats.mtime),
        size: w.stats.size,
      })),
    };
  } catch (error) {
    return {
      enabled: false,
      error: error.message,
    };
  }
}

module.exports = {
  initializeAutoRefresh,
  getAutoRefreshStatus,
};
