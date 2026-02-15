/**
 * File Watcher Manager - Central Auto-Refresh System
 *
 * Resolves the "window always out of date" problem by:
 * 1. Watching critical files for changes
 * 2. Auto-invalidating caches on file updates
 * 3. Triggering synchronized refreshes across all systems
 * 4. Handling Prisma schema regeneration
 * 5. Syncing agents to IDEs
 *
 * Part of Solution: AIOS Auto-Update System
 * Last Updated: 2026-02-12
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class FileWatcherManager extends EventEmitter {
  constructor(options = {}) {
    super();

    this.watchers = new Map();
    this.watchedPaths = new Map();
    this.debounceTimers = new Map();
    this.debounceDelay = options.debounceDelay || 500; // ms

    // Cache invalidation callbacks
    this.invalidationCallbacks = new Map();

    // Track watched files
    this.fileStats = new Map();

    console.log('✨ FileWatcherManager initialized');
  }

  /**
   * Register a file to watch with invalidation callbacks
   *
   * @param {string} filePath - Full path to file
   * @param {string} watchId - Unique identifier for this watch
   * @param {Object} callbacks - Event callbacks
   *   - onChanged(filePath): Fired when file changes
   *   - onDeleted(filePath): Fired when file is deleted
   *   - onCreated(filePath): Fired when file is created
   */
  registerWatch(filePath, watchId, callbacks = {}) {
    try {
      // Resolve to absolute path
      const absolutePath = path.resolve(filePath);

      // Check if file exists
      if (!fs.existsSync(absolutePath)) {
        console.warn(`⚠️ Watch: File does not exist: ${absolutePath}`);
        return false;
      }

      // Store initial stats
      const stats = fs.statSync(absolutePath);
      this.fileStats.set(watchId, {
        path: absolutePath,
        mtime: stats.mtimeMs,
        size: stats.size,
      });

      // Create watcher
      const watcher = fs.watch(absolutePath, { persistent: true }, (eventType, filename) => {
        this._handleFileChange(watchId, absolutePath, eventType, callbacks);
      });

      watcher.on('error', (err) => {
        console.error(`❌ Watcher error for ${watchId}:`, err);
        this.emit('error', { watchId, error: err });
      });

      this.watchers.set(watchId, watcher);
      this.watchedPaths.set(watchId, absolutePath);
      this.invalidationCallbacks.set(watchId, callbacks);

      console.log(`👁️  Watching: ${watchId} → ${absolutePath}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to register watch for ${watchId}:`, error.message);
      return false;
    }
  }

  /**
   * Handle file change with debouncing
   * @private
   */
  _handleFileChange(watchId, filePath, eventType, callbacks) {
    // Debounce: Only process once per 500ms
    if (this.debounceTimers.has(watchId)) {
      clearTimeout(this.debounceTimers.get(watchId));
    }

    const timer = setTimeout(() => {
      try {
        const stats = fs.statSync(filePath);
        const oldStats = this.fileStats.get(watchId);

        // Check if truly changed (not just metadata)
        if (oldStats && stats.mtimeMs === oldStats.mtime && stats.size === oldStats.size) {
          return; // No real change
        }

        // Update stats
        this.fileStats.set(watchId, {
          path: filePath,
          mtime: stats.mtimeMs,
          size: stats.size,
        });

        // Emit appropriate callback
        if (eventType === 'change' && callbacks.onChanged) {
          console.log(`✏️  Changed: ${watchId}`);
          callbacks.onChanged(filePath);
          this.emit('file-changed', { watchId, path: filePath });
        }

      } catch (error) {
        if (error.code === 'ENOENT' && callbacks.onDeleted) {
          console.log(`🗑️  Deleted: ${watchId}`);
          callbacks.onDeleted(filePath);
          this.emit('file-deleted', { watchId, path: filePath });
          this.unwatch(watchId); // Stop watching deleted file
        } else {
          console.error(`❌ Error handling change for ${watchId}:`, error.message);
        }
      }

      this.debounceTimers.delete(watchId);
    }, this.debounceDelay);

    this.debounceTimers.set(watchId, timer);
  }

  /**
   * Stop watching a file
   */
  unwatch(watchId) {
    const watcher = this.watchers.get(watchId);
    if (watcher) {
      watcher.close();
      this.watchers.delete(watchId);
      this.watchedPaths.delete(watchId);
      this.invalidationCallbacks.delete(watchId);
      this.fileStats.delete(watchId);
      console.log(`👋 Unwatched: ${watchId}`);
    }
  }

  /**
   * Stop all watchers
   */
  unwatchAll() {
    for (const [watchId] of this.watchers) {
      this.unwatch(watchId);
    }
    console.log('👋 All watchers stopped');
  }

  /**
   * Get list of all watched files
   */
  getWatched() {
    const watched = [];
    for (const [watchId, filePath] of this.watchedPaths) {
      watched.push({
        id: watchId,
        path: filePath,
        stats: this.fileStats.get(watchId),
      });
    }
    return watched;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// GLOBAL INSTANCE & INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════════

const globalWatcherManager = new FileWatcherManager();

/**
 * Initialize all watches for AIOS system
 * Call this ONCE at application startup
 */
function initializeAutoRefresh() {
  const projectRoot = process.cwd();

  // ─────────────────────────────────────────────────────────────────────────────────
  // 1. AGENT CHANGES → IDE SYNC
  // ─────────────────────────────────────────────────────────────────────────────────

  const agentsDir = path.join(projectRoot, '.aios-core', 'development', 'agents');
  if (fs.existsSync(agentsDir)) {
    // Watch agent files
    const agentFiles = fs.readdirSync(agentsDir);
    agentFiles.forEach(file => {
      if (file.endsWith('.md') || file.endsWith('.yaml')) {
        const filePath = path.join(agentsDir, file);
        globalWatcherManager.registerWatch(filePath, `agent:${file}`, {
          onChanged: (filePath) => {
            console.log(`🔄 Agent changed: ${file} → Triggering IDE sync`);
            triggerIDESync(filePath);
            invalidateConfigCache('agents');
          },
        });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────────
  // 2. PRISMA SCHEMA CHANGES → AUTO-REGENERATE CLIENT
  // ─────────────────────────────────────────────────────────────────────────────────

  const services = ['community', 'marketplace', 'academy', 'business'];
  services.forEach(service => {
    const schemaPath = path.join(projectRoot, 'services', service, 'prisma', 'schema.prisma');
    if (fs.existsSync(schemaPath)) {
      globalWatcherManager.registerWatch(schemaPath, `prisma:${service}`, {
        onChanged: (filePath) => {
          console.log(`🔄 Prisma schema changed: ${service} → Auto-regenerating client`);
          triggerPrismaGenerate(service);
          invalidateConfigCache(`prisma:${service}`);
        },
      });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────────
  // 3. STORY CHANGES → WORKFLOW NAVIGATOR REFRESH
  // ─────────────────────────────────────────────────────────────────────────────────

  const storiesDir = path.join(projectRoot, 'docs', 'stories');
  if (fs.existsSync(storiesDir)) {
    globalWatcherManager.registerWatch(storiesDir, 'stories-dir', {
      onChanged: (filePath) => {
        console.log(`📖 Story changed: ${filePath} → Reloading workflow navigator`);
        invalidateConfigCache('workflow-navigator');
        triggerWorkflowNavigatorRefresh();
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────────
  // 4. WORKFLOW PATTERNS → CONFIG CACHE INVALIDATION
  // ─────────────────────────────────────────────────────────────────────────────────

  const workflowPatternsPath = path.join(projectRoot, '.aios-core', 'data', 'workflow-patterns.yaml');
  if (fs.existsSync(workflowPatternsPath)) {
    globalWatcherManager.registerWatch(workflowPatternsPath, 'workflow-patterns', {
      onChanged: (filePath) => {
        console.log(`🔄 Workflow patterns changed → Invalidating config cache`);
        invalidateConfigCache('workflow-patterns');
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────────
  // 5. PROJECT STATUS → CONTEXT LOADER REFRESH
  // ─────────────────────────────────────────────────────────────────────────────────

  const projectStatusPath = path.join(projectRoot, '.aios', 'project-status.yaml');
  if (fs.existsSync(projectStatusPath)) {
    globalWatcherManager.registerWatch(projectStatusPath, 'project-status', {
      onChanged: (filePath) => {
        console.log(`🔄 Project status changed → Refreshing context loader`);
        invalidateConfigCache('project-status');
        triggerContextLoaderRefresh();
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────────
  // 6. VITE CONFIG CHANGES → DEV SERVER RESTART HINT
  // ─────────────────────────────────────────────────────────────────────────────────

  const viteConfigPath = path.join(projectRoot, 'frontend', 'apps', 'prototype-vision', 'vite.config.ts');
  if (fs.existsSync(viteConfigPath)) {
    globalWatcherManager.registerWatch(viteConfigPath, 'vite-config', {
      onChanged: (filePath) => {
        console.log(`⚠️  Vite config changed → Dev server restart recommended`);
        console.log(`   Run: npm run dev:frontend`);
      },
    });
  }

  console.log('✅ Auto-refresh system initialized');
  console.log(`   Watching ${globalWatcherManager.watchers.size} critical files`);
}

/**
 * Trigger IDE synchronization when agents change
 * @private
 */
function triggerIDESync(agentFilePath) {
  try {
    const ideSyncModule = require('./ide-sync');
    if (ideSyncModule.commandSync) {
      setImmediate(() => {
        ideSyncModule.commandSync().catch(err => {
          console.error('❌ IDE sync error:', err.message);
        });
      });
    }
  } catch (error) {
    console.warn('⚠️  IDE sync not available:', error.message);
  }
}

/**
 * Trigger Prisma client regeneration
 * @private
 */
function triggerPrismaGenerate(service) {
  try {
    const { spawn } = require('child_process');
    const cwd = path.join(process.cwd(), 'services', service);

    const prisma = spawn('npx', ['prisma', 'generate'], {
      cwd,
      stdio: 'pipe',
      detached: false,
    });

    prisma.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Prisma client regenerated for ${service}`);
      } else {
        console.error(`❌ Prisma generation failed for ${service}: exit code ${code}`);
      }
    });

    prisma.on('error', (err) => {
      console.error(`❌ Prisma generation error for ${service}:`, err.message);
    });
  } catch (error) {
    console.warn(`⚠️  Prisma generation skipped for ${service}:`, error.message);
  }
}

/**
 * Invalidate config cache entry
 * @private
 */
function invalidateConfigCache(key) {
  try {
    const { globalConfigCache } = require('../config/config-cache');
    globalConfigCache.invalidate(key);
    console.log(`🗑️  Cache invalidated: ${key}`);
  } catch (error) {
    console.warn(`⚠️  Config cache invalidation failed: ${error.message}`);
  }
}

/**
 * Trigger workflow navigator refresh
 * @private
 */
function triggerWorkflowNavigatorRefresh() {
  try {
    const workflowNavigatorPath = path.join(process.cwd(), '.aios-core', 'development', 'scripts', 'workflow-navigator.js');
    if (fs.existsSync(workflowNavigatorPath)) {
      delete require.cache[require.resolve(workflowNavigatorPath)];
      console.log('🔄 Workflow navigator reloaded');
    }
  } catch (error) {
    console.warn(`⚠️  Workflow navigator refresh failed: ${error.message}`);
  }
}

/**
 * Trigger context loader refresh
 * @private
 */
function triggerContextLoaderRefresh() {
  try {
    const contextLoaderPath = path.join(process.cwd(), '.aios-core', 'core', 'session', 'context-loader.js');
    if (fs.existsSync(contextLoaderPath)) {
      delete require.cache[require.resolve(contextLoaderPath)];
      console.log('🔄 Context loader reloaded');
    }
  } catch (error) {
    console.warn(`⚠️  Context loader refresh failed: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════════

module.exports = {
  FileWatcherManager,
  globalWatcherManager,
  initializeAutoRefresh,
};
