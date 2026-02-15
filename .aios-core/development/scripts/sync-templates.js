#!/usr/bin/env node

/**
 * Automatic Template Synchronization Script
 *
 * Sincroniza templates AIOS com repositório remoto automaticamente.
 * Monitora mudanças locais e faz push automático quando mudanças são detectadas.
 *
 * Uso:
 *   npm run sync:templates          # Sincronização única
 *   npm run sync:templates:watch    # Modo watch (contínuo)
 *
 * Configuração: .aios-core/config/templates-sync.yaml
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');
const yaml = require('js-yaml');

// Configuração
const CONFIG_PATH = path.join(__dirname, '../config/templates-sync.yaml');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const GIT_COMMIT_MESSAGE = 'chore(aios): auto-sync templates from local changes';

class TemplateSync {
  constructor() {
    this.config = this.loadConfig();
    this.isRunning = false;
    this.pendingChanges = new Set();
    this.debounceTimer = null;
    this.debounceDelay = 5000; // 5 segundos
  }

  loadConfig() {
    try {
      if (!fs.existsSync(CONFIG_PATH)) {
        console.warn(`⚠️  Config file not found: ${CONFIG_PATH}`);
        console.warn('    Using default configuration');
        return this.defaultConfig();
      }

      const content = fs.readFileSync(CONFIG_PATH, 'utf8');
      return yaml.load(content);
    } catch (error) {
      console.error(`❌ Error loading config: ${error.message}`);
      return this.defaultConfig();
    }
  }

  defaultConfig() {
    return {
      enabled: true,
      watch_mode: false,
      auto_sync: true,
      debounce_ms: 5000,
      excluded_patterns: ['node_modules', '.git', '*.tmp'],
      commit_prefix: 'chore(aios)',
      templates: [
        'brownfield-architecture-tmpl.yaml',
        'front-end-spec-tmpl.yaml',
        'architecture-tmpl.yaml',
        'fullstack-architecture-tmpl.yaml'
      ],
      branch: 'main',
      dry_run: false
    };
  }

  /**
   * Sincronização única - verifica mudanças e faz push se necessário
   */
  async syncOnce() {
    console.log('🔄 Iniciando sincronização de templates...');

    try {
      // 1. Verificar se há mudanças nos templates
      const changes = this.detectChanges();

      if (changes.length === 0) {
        console.log('✓ Nenhuma mudança detectada em templates');
        return { synced: false, changes: [] };
      }

      console.log(`\n📝 ${changes.length} ficheiro(s) modificado(s):`);
      changes.forEach(file => console.log(`   • ${path.basename(file)}`));

      // 2. Fazer commit automático
      if (this.config.auto_sync) {
        await this.autoCommit(changes);
        console.log('✅ Commit automático realizado');
      }

      // 3. Fazer push para remoto
      if (!this.config.dry_run) {
        await this.pushToRemote();
        console.log('✅ Push para remoto realizado');
      }

      return { synced: true, changes };
    } catch (error) {
      console.error(`\n❌ Erro na sincronização: ${error.message}`);
      throw error;
    }
  }

  /**
   * Modo watch - monitora mudanças contínuas
   */
  watchMode() {
    console.log('👀 Modo watch ativado - monitorando mudanças de templates');
    console.log(`📁 Observando: ${TEMPLATES_DIR}`);
    console.log('   Pressione Ctrl+C para parar\n');

    const watcher = chokidar.watch(TEMPLATES_DIR, {
      ignored: this.config.excluded_patterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });

    watcher
      .on('add', (file) => this.handleFileChange(file, 'CRIADO'))
      .on('change', (file) => this.handleFileChange(file, 'MODIFICADO'))
      .on('unlink', (file) => this.handleFileChange(file, 'REMOVIDO'))
      .on('error', (error) => console.error(`❌ Erro no watch: ${error.message}`));

    process.on('SIGINT', () => {
      console.log('\n\n⏹️  Parando monitor de templates...');
      watcher.close();
      process.exit(0);
    });
  }

  /**
   * Manipula mudanças detectadas (com debounce)
   */
  handleFileChange(file, action) {
    const relPath = path.relative(TEMPLATES_DIR, file);

    // Ignorar ficheiros não-YAML ou em padrões excluídos
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) {
      return;
    }

    console.log(`📝 Template ${action}: ${relPath}`);

    this.pendingChanges.add(file);

    // Debounce: aguardar antes de fazer sync
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.syncChanges();
    }, this.config.debounce_ms);
  }

  /**
   * Sincroniza mudanças pendentes
   */
  async syncChanges() {
    if (this.isRunning || this.pendingChanges.size === 0) {
      return;
    }

    this.isRunning = true;

    try {
      console.log(`\n⏱️  Sincronizando ${this.pendingChanges.size} mudança(s)...`);

      const changes = Array.from(this.pendingChanges);
      this.pendingChanges.clear();

      // Fazer commit automático
      if (this.config.auto_sync) {
        await this.autoCommit(changes);
        console.log('✅ Commit automático realizado');
      }

      // Fazer push para remoto
      if (!this.config.dry_run) {
        await this.pushToRemote();
        console.log('✅ Push para remoto realizado\n');
      }
    } catch (error) {
      console.error(`❌ Erro na sincronização: ${error.message}`);
      // Não parar o watch, tentar novamente na próxima mudança
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Detecta mudanças em templates
   */
  detectChanges() {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });

      return output
        .split('\n')
        .filter(line => line.trim())
        .filter(line => line.includes('templates/'))
        .filter(line => line.includes('.yaml') || line.includes('.yml'))
        .map(line => {
          // Extrair caminho do ficheiro
          return line.substring(3).trim();
        });
    } catch (error) {
      console.error(`⚠️  Erro ao detectar mudanças: ${error.message}`);
      return [];
    }
  }

  /**
   * Faz commit automático
   */
  async autoCommit(files) {
    try {
      // 1. Fazer stage dos ficheiros
      execSync(`git add ${files.map(f => `"${f}"`).join(' ')}`, {
        cwd: process.cwd()
      });

      // 2. Verificar se há mudanças após stage
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim() === '') {
        console.log('ℹ️  Nenhuma mudança para fazer commit');
        return;
      }

      // 3. Fazer commit com mensagem automática
      const timestamp = new Date().toISOString();
      const message = `${this.config.commit_prefix}: auto-sync templates [${timestamp}]`;

      execSync(`git commit -m "${message}"`, {
        cwd: process.cwd()
      });

      console.log(`✓ Commit: ${message}`);
    } catch (error) {
      // Se falhar, apenas alertar (pode ser "nothing to commit")
      if (!error.message.includes('nothing to commit')) {
        throw error;
      }
    }
  }

  /**
   * Faz push para remoto
   */
  async pushToRemote() {
    try {
      // Obter branch atual
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8'
      }).trim();

      // Push para remoto
      execSync(`git push origin ${currentBranch}`, {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      console.log(`✓ Push para origin/${currentBranch}`);
    } catch (error) {
      if (error.message.includes('nothing to push')) {
        console.log('ℹ️  Nada para fazer push');
      } else {
        throw error;
      }
    }
  }

  /**
   * Status da sincronização
   */
  status() {
    console.log('\n📊 STATUS DA SINCRONIZAÇÃO DE TEMPLATES\n');
    console.log(`Configuração:`);
    console.log(`  ✓ Auto-sync: ${this.config.auto_sync ? 'ativado' : 'desativado'}`);
    console.log(`  ✓ Watch mode: ${this.config.watch_mode ? 'ativado' : 'desativado'}`);
    console.log(`  ✓ Dry run: ${this.config.dry_run ? 'ativado' : 'desativado'}`);
    console.log(`  ✓ Debounce: ${this.config.debounce_ms}ms`);
    console.log(`\nTemplates monitorados:`);
    this.config.templates.forEach(t => console.log(`  • ${t}`));
    console.log('\n');
  }
}

// Main
async function main() {
  const command = process.argv[2] || 'sync';
  const sync = new TemplateSync();

  try {
    switch (command) {
      case 'sync':
        await sync.syncOnce();
        break;

      case 'watch':
        sync.watchMode();
        break;

      case 'status':
        sync.status();
        break;

      default:
        console.log(`Uso:
  npm run sync:templates           # Sincronização única
  npm run sync:templates -- watch  # Modo watch (contínuo)
  npm run sync:templates -- status # Ver status
`);
    }
  } catch (error) {
    process.exit(1);
  }
}

main();
