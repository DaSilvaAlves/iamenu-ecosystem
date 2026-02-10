---
tools:
  - node-js
  - workflow-orchestrator
metadata:
  agent: aios-master
  workflow: brownfield-discovery
  purpose: "Execute brownfield-discovery workflow with real-time progress display"
  duration_estimate: "4-6 hours"
  created_date: 2026-02-10
---

# Execute Workflow: Brownfield Discovery

## Purpose

Execute the complete brownfield-discovery workflow with real-time progress visualization, subagent dispatch, and final summary. This is the primary entry point for running the discovery workflow.

This task:
1. Loads the brownfield-discovery.yaml workflow definition
2. Instantiates WorkflowOrchestrator with progress callbacks
3. Executes all 11 phases sequentially/parallel as configured
4. Displays real-time progress (phase number, name, agent, progress %)
5. Handles errors gracefully (skip failed phases, continue workflow)
6. Provides final summary with generated files and next steps

## When to Use This Task

Use this task when:
- User executes `*workflow brownfield-discovery` and selects "YOLO Mode"
- You need to run the complete discovery workflow automatically
- User wants 4-6 hours of autonomous execution with minimal interaction
- Brownfield project needs comprehensive technical debt assessment

**NOT for:**
- Individual phase execution (run phases manually with agent commands)
- Interactive/step-by-step workflows (use brownfield-discovery.yaml directly)
- Testing individual components (test components separately)

## Inputs

**Configuration:**
- Execution mode: `yolo` (from user selection in startup)
- Parallel execution: `true` (phases 1-3 run in parallel)
- Progress callbacks: enabled (real-time display)

**Required Files:**
- `.aios-core/development/workflows/brownfield-discovery.yaml` - Workflow definition
- WorkflowOrchestrator class and dependencies (already instantiated)

**Optional Environment:**
- `.env` - Environment variables for tech stack detection
- `supabase/` directory - For database detection
- `package.json` - For tech stack analysis

## Outputs

**Console Output (Real-Time):**
```
═══════════════════════════════════════════════════════════
  FASE 1/11: Coleta - Sistema
  Agent: @architect | Task: document-project.md
  Progress: 9% | Elapsed: 15.3 min
═══════════════════════════════════════════════════════════

[architect persona activated]
Analyzing system architecture...
✅ Created: docs/architecture/system-architecture.md

✅ FASE 1 COMPLETA
   📄 Created: docs/architecture/system-architecture.md
```

**Final Summary (After Completion):**
```
═══════════════════════════════════════════════════════════
  ✅ WORKFLOW COMPLETO!
═══════════════════════════════════════════════════════════

📊 Resultados:
   Fases completadas: 11/11
   Tempo total: 240 minutos
   Fases falhadas: 0

📁 Ficheiros Gerados:
   docs/reports/TECHNICAL-DEBT-REPORT.md
   docs/stories/epic-technical-debt.md
   docs/stories/story-*.md
   .aios/workflow-state/development-activation.json

🚀 Próximos Passos:
   1. Rever relatório: docs/reports/TECHNICAL-DEBT-REPORT.md
   2. Ativar desenvolvimento: @dev
   3. Executar primeira história: *develop TECH-DEBT-001.1
```

## Algorithm

### Step 1: Initialize Orchestrator

```javascript
const path = require('path');
const chalk = require('chalk');
const { WorkflowOrchestrator } = require('../core/orchestration');

async function executeWorkflow() {
  // Load workflow definition
  const workflowPath = path.join(__dirname, '../workflows/brownfield-discovery.yaml');
  const orchestrator = new WorkflowOrchestrator(workflowPath, {
    yolo: true,
    parallel: true,
    projectRoot: process.cwd(),
  });
```

### Step 2: Register Progress Callbacks

```javascript
  // Track execution state
  let currentPhase = 0;
  let totalPhases = 11;
  let startTime = Date.now();

  orchestrator.options.onPhaseStart = (phase) => {
    currentPhase = phase.phase;
    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const progress = Math.round((currentPhase / totalPhases) * 100);

    console.log(chalk.blue(`\n${'═'.repeat(60)}`));
    console.log(chalk.blue.bold(`  FASE ${phase.phase}/${totalPhases}: ${phase.phase_name}`));
    console.log(chalk.gray(`  Agent: @${phase.agent} | Task: ${phase.task || phase.action}`));
    console.log(chalk.gray(`  Progress: ${progress}% | Elapsed: ${elapsed} min`));
    console.log(chalk.blue(`${'═'.repeat(60)}\n`));
  };

  orchestrator.options.onPhaseComplete = (phase, result) => {
    const status = result.success ? '✅' : '❌';
    console.log(chalk.green(`\n${status} FASE ${phase.phase} COMPLETA`));
    if (phase.creates) {
      const creates = Array.isArray(phase.creates) ? phase.creates : [phase.creates];
      creates.forEach((c) => console.log(chalk.gray(`   📄 Created: ${c}`)));
    }
  };
```

### Step 3: Execute Workflow

```javascript
  console.log(chalk.cyan('\n🚀 Starting Brownfield Discovery Workflow'));
  console.log(chalk.gray(`   Mode: YOLO (Autonomous)`));
  console.log(chalk.gray(`   Duration: ~4-6 hours`));
  console.log(chalk.gray(`   Phases: 11\n`));

  const result = await orchestrator.execute();
```

### Step 4: Display Final Summary

```javascript
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log(chalk.green(`\n${'═'.repeat(60)}`));
  console.log(chalk.green.bold(`  ✅ WORKFLOW COMPLETO!`));
  console.log(chalk.green(`${'═'.repeat(60)}\n`));

  console.log(chalk.bold('📊 Resultados:'));
  console.log(chalk.gray(`   Fases completadas: ${result.completedPhases.length}/${totalPhases}`));
  console.log(chalk.gray(`   Tempo total: ${totalTime} minutos`));
  console.log(chalk.gray(`   Fases falhadas: ${result.failedPhases.length}`));

  console.log(chalk.bold('\n📁 Ficheiros Gerados:'));
  console.log(chalk.gray(`   docs/reports/TECHNICAL-DEBT-REPORT.md`));
  console.log(chalk.gray(`   docs/stories/epic-technical-debt.md`));
  console.log(chalk.gray(`   docs/stories/story-*.md`));
  console.log(chalk.gray(`   .aios/workflow-state/development-activation.json`));

  console.log(chalk.bold('\n🚀 Próximos Passos:'));
  console.log(chalk.cyan(`   1. Rever relatório: docs/reports/TECHNICAL-DEBT-REPORT.md`));
  console.log(chalk.cyan(`   2. Ativar desenvolvimento: @dev`));
  console.log(chalk.cyan(`   3. Executar primeira história: *develop TECH-DEBT-001.1\n`));

  return result;
}

// Execute
executeWorkflow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(`\n❌ Workflow falhou: ${error.message}`));
    process.exit(1);
  });
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Workflow file not found | Exit with clear error message |
| Phase execution fails | Log error, continue to next phase (unless blocking) |
| Subagent dispatch fails | Retry once, then mark as failed |
| File creation fails | Log warning, continue (non-blocking) |
| Progress callback error | Catch and log, continue execution |
| User interrupts (Ctrl+C) | Catch signal, display summary, exit |

## Success Criteria

- [ ] Progress displays immediately after starting
- [ ] Each phase shows: number, name, agent, task, elapsed time, progress %
- [ ] Elapsed time updates correctly and increases
- [ ] Phase completions show created files
- [ ] All 11 phases execute without manual intervention
- [ ] Workflow completes in 4-6 hours
- [ ] Final summary lists all generated files
- [ ] Final summary shows clear next steps
- [ ] No unhandled errors or exceptions
- [ ] Exit code is 0 on success, 1 on failure

## Related Files

- **Workflow:** `.aios-core/development/workflows/brownfield-discovery.yaml` (workflow definition)
- **Orchestrator:** `.aios-core/core/orchestration/workflow-orchestrator.js` (execution engine)
- **AIOS Master:** `.aios-core/development/agents/aios-master.md` (agent definition)
- **Activation Task:** `.aios-core/development/tasks/activate-development.md` (Phase 11)

## Notes

- This task is the PRIMARY ENTRY POINT for brownfield-discovery workflow
- Requires WorkflowOrchestrator to be properly instantiated
- Uses real subagent dispatch (not simulated)
- Progress callbacks are essential for user feedback
- Task completes in 4-6 hours (includes all 11 phases)
- Follow execution flow: startup menu → YOLO selection → this task → Phase 11 → development activation
