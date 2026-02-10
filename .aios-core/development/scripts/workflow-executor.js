/**
 * Workflow Executor - Generic workflow execution with progress visualization
 *
 * Provides reusable execution engine for any workflow YAML with:
 * - Progress bar rendering
 * - Time estimation and elapsed tracking
 * - Phase status tracking
 * - Result formatting
 * - Error handling
 *
 * @module development/scripts/workflow-executor
 * @version 1.0.0
 */

const path = require('path');
const chalk = require('chalk');
const WorkflowOrchestrator = require('../core/orchestration/workflow-orchestrator');

/**
 * Generic workflow executor with progress visualization
 */
class WorkflowExecutor {
  /**
   * @param {string} workflowName - Name of workflow (e.g., 'brownfield-discovery')
   * @param {Object} options - Execution options
   * @param {string} options.mode - Execution mode: 'yolo' | 'interactive' | 'preflight'
   * @param {boolean} options.parallel - Enable parallel execution (default: true)
   * @param {boolean} options.showProgress - Show real-time progress (default: true)
   * @param {string} options.projectRoot - Project root directory (default: cwd)
   */
  constructor(workflowName, options = {}) {
    this.workflowName = workflowName;
    this.options = {
      mode: options.mode || 'yolo',
      parallel: options.parallel !== false,
      showProgress: options.showProgress !== false,
      projectRoot: options.projectRoot || process.cwd(),
    };

    // Execution tracking
    this.state = {
      startTime: null,
      currentPhase: 0,
      totalPhases: 0,
      completedPhases: [],
      failedPhases: [],
      skippedPhases: [],
    };

    // Find workflow file
    this.workflowPath = path.join(
      this.options.projectRoot,
      '.aios-core/development/workflows',
      `${workflowName}.yaml`
    );
  }

  /**
   * Run the workflow with progress visualization
   * @returns {Promise<Object>} Execution result
   */
  async run() {
    this.state.startTime = Date.now();

    try {
      // Create orchestrator with progress callbacks
      const orchestrator = new WorkflowOrchestrator(this.workflowPath, {
        yolo: this.options.mode === 'yolo',
        parallel: this.options.parallel,
        projectRoot: this.options.projectRoot,
        onPhaseStart: this._onPhaseStart.bind(this),
        onPhaseComplete: this._onPhaseComplete.bind(this),
      });

      // Load workflow to get phase count
      await orchestrator.loadWorkflow();
      this.state.totalPhases = orchestrator.workflow.sequence?.length || 0;

      // Display startup message
      this._displayStartup();

      // Execute workflow
      const result = await orchestrator.execute();

      // Display summary
      this._displaySummary(result);

      return result;
    } catch (error) {
      this._displayError(error);
      throw error;
    }
  }

  /**
   * Phase start callback
   * @private
   */
  _onPhaseStart(phase) {
    this.state.currentPhase = phase.phase;

    if (!this.options.showProgress) return;

    const elapsed = this._getElapsedTime();
    const progress = Math.round((this.state.currentPhase / this.state.totalPhases) * 100);
    const icon = this._getAgentIcon(phase.agent);

    console.log(chalk.blue(`\n${'═'.repeat(70)}`));
    console.log(chalk.blue.bold(`  ${icon} FASE ${phase.phase}/${this.state.totalPhases}: ${phase.phase_name}`));
    console.log(chalk.gray(`      Agent: @${phase.agent} | Task: ${phase.task || phase.action}`));
    console.log(chalk.gray(`      Progresso: ${progress}% | Tempo: ${elapsed} min`));
    console.log(chalk.blue(`${'═'.repeat(70)}`));
  }

  /**
   * Phase complete callback
   * @private
   */
  _onPhaseComplete(phase, result) {
    if (!this.options.showProgress) return;

    const status = result?.success ? '✅' : result?.status === 'pending_dispatch' ? '📤' : '⚠️';
    console.log(chalk.green(`   ${status} Fase ${phase.phase} completa`));

    if (phase.creates) {
      const creates = Array.isArray(phase.creates) ? phase.creates : [phase.creates];
      creates.forEach((c) => {
        console.log(chalk.gray(`      → ${c}`));
      });
    }

    this.state.completedPhases.push(phase.phase);
  }

  /**
   * Get elapsed time in minutes
   * @private
   */
  _getElapsedTime() {
    const elapsed = Date.now() - this.state.startTime;
    return (elapsed / 1000 / 60).toFixed(1);
  }

  /**
   * Get agent icon for display
   * @private
   */
  _getAgentIcon(agentId) {
    const icons = {
      architect: '🏗️',
      'data-engineer': '🗄️',
      'ux-expert': '🎨',
      'ux-design-expert': '🎨',
      qa: '🔍',
      analyst: '📊',
      pm: '📋',
      dev: '💻',
      sm: '🔄',
      po: '⚖️',
      devops: '🚀',
      'github-devops': '🚀',
    };
    return icons[agentId] || '👤';
  }

  /**
   * Display startup message
   * @private
   */
  _displayStartup() {
    console.log(chalk.cyan('\n🚀 Starting Workflow: ' + this.workflowName));
    console.log(chalk.gray(`   Mode: ${this.options.mode.toUpperCase()}`));
    console.log(chalk.gray(`   Parallel execution: ${this.options.parallel ? 'enabled' : 'disabled'}`));
    console.log(chalk.gray(`   Phases: ${this.state.totalPhases}\n`));
  }

  /**
   * Display final summary
   * @private
   */
  _displaySummary(result) {
    const totalTime = this._getElapsedTime();

    console.log(chalk.green(`\n${'═'.repeat(70)}`));
    console.log(chalk.green.bold(`  ✅ WORKFLOW COMPLETO!`));
    console.log(chalk.green(`${'═'.repeat(70)}\n`));

    console.log(chalk.bold('📊 Resultados:'));
    console.log(chalk.gray(`   Fases completadas: ${result.phases.completed}/${result.phases.total}`));
    console.log(chalk.gray(`   Tempo total: ${totalTime} minutos`));
    console.log(chalk.gray(`   Fases falhadas: ${result.phases.failed}`));
    console.log(chalk.gray(`   Fases puladas: ${result.phases.skipped}`));

    if (result.phases.failed > 0) {
      console.log(chalk.yellow(`\n⚠️  Fases com falha: ${result.failedPhases.join(', ')}`));
    }

    console.log(chalk.bold('\n🚀 Próximos Passos:'));
    console.log(chalk.cyan(`   Ver documentação: docs/reports/ e docs/stories/`));
    console.log(chalk.cyan(`   Ativar desenvolvimento: @dev`));
    console.log(chalk.cyan(`   Consulte summary acima para detalhes\n`));
  }

  /**
   * Display error message
   * @private
   */
  _displayError(error) {
    console.error(chalk.red(`\n❌ Workflow falhou:`));
    console.error(chalk.red(`   ${error.message}`));
    console.error(chalk.gray(`   Tempo decorrido: ${this._getElapsedTime()} min`));
  }

  /**
   * Get execution state
   */
  getState() {
    return { ...this.state };
  }
}

module.exports = WorkflowExecutor;
