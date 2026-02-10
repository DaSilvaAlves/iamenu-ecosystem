---
tools:
  - file-system
  - node-js
metadata:
  agent: pm
  phase: brownfield-discovery-11
  purpose: "Prepare development handoff with prioritized story list"
  created_date: 2026-02-10
---

# Activate Development Task

## Purpose

Execute Phase 11 of brownfield-discovery workflow: prepare development handoff with prioritized story list and clear activation commands for @dev agent.

This task:
1. Loads all stories created in Phase 10
2. Extracts metadata (ID, priority, points, status, title)
3. Sorts by priority (CRITICAL → HIGH → MEDIUM)
4. Generates formatted output with activation commands
5. Saves context to `.aios/workflow-state/development-activation.json`

## When to Use This Task

Use this task:
- **After** Phase 10 (story creation) completes in brownfield-discovery workflow
- When stories have been created and need prioritization for development
- To provide clear guidance on which story to implement first
- To enable workflow-navigator.js suggestions for @dev activation

## Inputs

**Required Files:**
- `docs/stories/epic-technical-debt.md` - Epic created in Phase 10
- `docs/stories/story-*.md` - Stories created in Phase 10 (1 or more)

**Expected Story Metadata Format:**

Each story file should contain YAML frontmatter:
```yaml
---
id: TECH-DEBT-001.1
priority: CRITICAL  # CRITICAL | HIGH | MEDIUM | LOW
points: 21
title: Implement RLS Policies
status: Ready for Dev  # Ready for Dev | In Progress | Completed
---
```

## Outputs

**Console Output (User-Facing):**
- Formatted list of prioritized stories
- Clear 3-step next steps
- Activation commands ready to copy/paste
- Execution mode guidance

**Context File (.aios/workflow-state/development-activation.json):**
```json
{
  "timestamp": "2026-02-10T...",
  "epic": "docs/stories/epic-technical-debt.md",
  "stories": [
    {
      "id": "TECH-DEBT-001.1",
      "priority": "CRITICAL",
      "title": "Implement RLS Policies",
      "points": 21,
      "status": "Ready for Dev",
      "activationCommand": "*develop TECH-DEBT-001.1"
    }
  ],
  "recommendedNext": "TECH-DEBT-001.1",
  "workflow": "brownfield-discovery",
  "phase": 11
}
```

## Instructions

### Step 1: Load Stories Directory

1. Check if `docs/stories/` directory exists
2. If not found, exit gracefully with message: "Nenhuma story encontrada. Execute Phase 10 primeiro (criar stories)."
3. List all files matching pattern: `story-*.md`

### Step 2: Parse Story Metadata

For each story file:
1. Read file content
2. Extract YAML frontmatter (between `---` markers)
3. Parse fields: `id`, `priority`, `title`, `points`, `status`
4. Handle missing metadata gracefully:
   - Missing `id`: Use filename stem (e.g., `story-1.1-security` → `1.1-security`)
   - Missing `priority`: Default to `MEDIUM` (warn user)
   - Missing `points`: Default to `0` (warn user)
   - Missing `title`: Use filename as title (warn user)
   - Missing `status`: Default to `Ready for Dev` (no warning)

### Step 3: Sort Stories by Priority

Create priority order mapping:
```
CRITICAL = 1 (highest)
HIGH     = 2
MEDIUM   = 3
LOW      = 4 (lowest)
```

Sort stories array by priority (ascending), then by ID (alphabetically).

### Step 4: Generate Output

Generate user-facing output with sections:

#### Section 1: Header
```
✅ DISCOVERY COMPLETO!

📋 Stories Prontas para Desenvolvimento
═════════════════════════════════════════════
```

#### Section 2: Prioritized Stories (sorted)

```
**CRITICAL (implementar primeiro):**
1. Story TECH-DEBT-001.1: Implement RLS Policies
   Status: Ready for Dev
   Esforço: 21 points (~3 dias)
   Ativação: *develop TECH-DEBT-001.1

**HIGH (após críticas):**
2. Story TECH-DEBT-001.2: Add Database Indexes
   Status: Ready for Dev
   Esforço: 13 points (~2 dias)
   Ativação: *develop TECH-DEBT-001.2

**MEDIUM (depois):**
3. Story TECH-DEBT-001.3: Design System Components
   Status: Ready for Dev
   Esforço: 8 points (~1 dia)
   Ativação: *develop TECH-DEBT-001.3
```

#### Section 3: Próximos Passos (Next Steps)

```
🚀 Próximos Passos
═════════════════════════════════════════════

1. **Ativar agente de desenvolvimento**
   Digite: @dev

2. **Selecionar first CRITICAL story**
   Digite: *develop TECH-DEBT-001.1

3. **Escolher modo de execução**
   - *develop TECH-DEBT-001.1 yolo          # Autônomo (máxima velocidade)
   - *develop TECH-DEBT-001.1 interactive   # Balanceado (padrão) [RECOMENDADO]
   - *develop TECH-DEBT-001.1 preflight     # Planning completo (máxima segurança)
```

#### Section 4: Execution Tips

```
💡 Dicas para Execução
═════════════════════════════════════════════

**Modo YOLO:**
- Para stories simples e bem definidas
- Máxima velocidade, mínimas interrupções
- Ideal para developers experientes com codebase

**Modo INTERACTIVE (RECOMENDADO):**
- Para aprender ou decisões complexas
- Balanceado entre velocidade e controle
- Checkpoints nos pontos críticos

**Modo PREFLIGHT:**
- Para stories ambíguas ou complexas
- Planning completo antes de implementação
- Melhor para stories com riscos elevados

Ready to activate @dev and start implementation! 🎯
```

### Step 5: Save Context File

Create `.aios/workflow-state/development-activation.json` with:
- Timestamp (ISO 8601 format)
- Epic path
- Full stories array with all metadata
- Recommended next story ID
- Workflow info (name: brownfield-discovery, phase: 11)

Handle errors gracefully:
- Directory creation fails: warn, continue (output generation still works)
- File write fails: warn, continue (primary goal still achieved)

## Algorithm (Pseudocode)

```javascript
async function activateDevelopment() {
  // 1. Validate stories directory
  const storiesPath = path.join(process.cwd(), 'docs', 'stories');
  if (!fs.existsSync(storiesPath)) {
    console.log('Nenhuma story encontrada. Execute Phase 10 primeiro (criar stories).');
    process.exit(0);
  }

  // 2. Load all story files
  const storyFiles = fs.readdirSync(storiesPath)
    .filter(f => f.startsWith('story-') && f.endsWith('.md'));

  if (storyFiles.length === 0) {
    console.log('Nenhuma story encontrada. Execute Phase 10 primeiro (criar stories).');
    process.exit(0);
  }

  // 3. Parse metadata for each story
  const stories = [];
  for (const file of storyFiles) {
    const content = fs.readFileSync(path.join(storiesPath, file), 'utf8');
    const metadata = extractFrontmatter(content);
    stories.push({
      ...metadata,
      filename: file,
      activationCommand: `*develop ${metadata.id}`
    });
  }

  // 4. Sort by priority and ID
  stories.sort((a, b) => {
    const priorityMap = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    const aPriority = priorityMap[a.priority] || 3;
    const bPriority = priorityMap[b.priority] || 3;

    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.id.localeCompare(b.id);
  });

  // 5. Generate formatted output
  const output = generateOutput(stories);
  console.log(output);

  // 6. Save context file
  const context = {
    timestamp: new Date().toISOString(),
    epic: 'docs/stories/epic-technical-debt.md',
    stories: stories,
    recommendedNext: stories[0]?.id || null,
    workflow: 'brownfield-discovery',
    phase: 11
  };

  try {
    const contextDir = path.join(process.cwd(), '.aios', 'workflow-state');
    fs.mkdirSync(contextDir, { recursive: true });
    fs.writeFileSync(
      path.join(contextDir, 'development-activation.json'),
      JSON.stringify(context, null, 2)
    );
  } catch (error) {
    console.warn(`⚠️  Aviso: Não foi possível salvar contexto: ${error.message}`);
  }
}
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| No stories directory | Exit gracefully, message in Portuguese |
| No story files found | Exit gracefully, guide to Phase 10 |
| Story missing metadata | Warn, use defaults, continue |
| Directory creation fails | Warn, continue (output still works) |
| File write fails | Warn, continue (primary goal achieved) |
| Invalid YAML in story | Warn, skip that field (use default) |

## Success Criteria

- [ ] All stories from Phase 10 appear in output
- [ ] Stories sorted by priority (CRITICAL first)
- [ ] Output contains copy/paste ready commands
- [ ] Output fits in single screen (no scrolling needed)
- [ ] Context file created with valid JSON
- [ ] Next steps are crystal clear
- [ ] Recommendations match actual story priorities
- [ ] No errors or exceptions occur

## Testing Checklist

### Unit Tests
- [ ] Story parsing: correctly extracts metadata
- [ ] Priority sorting: CRITICAL before HIGH before MEDIUM
- [ ] Template generation: output contains all required sections
- [ ] Context file: valid JSON with all fields

### Integration Tests
- [ ] Runs after Phase 10 completion
- [ ] Output suggests correct first story (@dev activation)
- [ ] workflow-navigator.js can load and use context
- [ ] Commands are executable and error-free

### Edge Cases
- [ ] No stories (graceful message)
- [ ] 1 story (works correctly)
- [ ] 10+ stories (still fits in output)
- [ ] Missing metadata (warnings, defaults used)
- [ ] Duplicate IDs (detected and warned)
- [ ] Invalid YAML (skipped gracefully)

## Related Files

- **Workflow:** `.aios-core/development/workflows/brownfield-discovery.yaml` (Phase 11)
- **Navigator:** `.aios-core/development/scripts/workflow-navigator.js` (context loading)
- **Agent:** `.aios-core/development/agents/pm.md` (PM agent definition)
- **Patterns:** `.aios-core/data/workflow-patterns.yaml` (workflow transitions)

## Notes

- This task is part of brownfield-discovery Phase 11 (Development Activation)
- Output is designed for @pm agent persona (Morgan, Strategist)
- Context file enables workflow-navigator.js automatic suggestions
- No external dependencies beyond Node.js fs/path modules
- Task completes in <10 seconds (fast feedback loop)
