---
última_atualização: 2025-12-16 21:30
agent: Claude Code
versão: 1.0
status: Aprovado
---

# REGRAS DE DOCUMENTAÇÃO - Projeto iaMenu Ecosystem

## 1. PRINCÍPIOS FUNDAMENTAIS

### Colaboração Multi-Agent
- **Claude Code** + **Gemini** trabalham em conjunto
- Toda decisão, alteração ou conclusão **É DOCUMENTADA**
- Nunca sobrescrever sem versionar
- Comunicação clara sobre o que cada agent fez
- Tag de identificação obrigatória em cada update

### Metodologia "Do Puxadinho à Mansão"
Seguir rigorosamente as 5 fases:
1. **Briefing** → Download cerebral completo (90% Humano / 10% IA)
2. **Detalhamento (PRD)** → Decisões críticas (70% Humano / 30% IA)
3. **Etapas** → Marcos validáveis (30% Humano / 70% IA)
4. **Tarefas** → Ações executáveis (10% Humano / 90% IA)
5. **Execução** → Código (0% Humano / 100% IA)

**REGRA DE OURO:** Nunca pular fases. Cada fase deve estar documentada e aprovada antes de avançar.

---

## 2. ESTRUTURA DE PASTAS

```
📁 iaMenu_Ecosystem/
├── 📁 00_META/                    # Governança e controlo
│   ├── REGRAS_DOCUMENTACAO.md     # Este ficheiro
│   ├── CHANGELOG.md               # Histórico de alterações
│   └── DECISOES_ARQUITETURA.md    # ADRs (Architecture Decision Records)
│
├── 📁 01_BRIEFING/                # Fase 1: Download Cerebral
│   ├── VISAO_ECOSSISTEMA.md       # Visão geral e propósito
│   ├── DORES_E_DESEJOS.md         # Problema a resolver
│   ├── PERSONAS.md                # Stakeholders detalhados
│   └── BRIEFING_COMPLETO.md       # Documento master da Fase 1
│
├── 📁 02_PRD/                     # Fase 2: Product Requirements Document
│   ├── PRD_iaMenu_Core.md         # Menu Digital (existente)
│   ├── PRD_GastroLens.md          # Ferramenta 1
│   ├── PRD_Marketing_Planner.md   # Ferramenta 2
│   ├── PRD_Fichas_Tecnicas.md     # Ferramenta 3
│   └── PRD_[Nova_Ferramenta].md   # Template para novas ferramentas
│
├── 📁 03_ARQUITETURA/             # Decisões técnicas
│   ├── STACK_TECNICO.md           # Tecnologias utilizadas
│   ├── DIAGRAMA_DADOS.md          # Modelo de dados
│   ├── INTEGRACOES.md             # APIs e integrações
│   └── DECISOES_TECNICAS.md       # Log de decisões técnicas
│
├── 📁 04_ETAPAS/                  # Fase 3: Roadmap e marcos
│   ├── ROADMAP.md                 # Visão temporal do projeto
│   ├── FASE_01_Core.md            # Etapa 1: Fundação
│   ├── FASE_02_Ferramentas.md     # Etapa 2: Ferramentas
│   └── FASE_03_Ecosistema.md      # Etapa 3: Integração completa
│
├── 📁 05_TAREFAS/                 # Fase 4: Gestão de trabalho
│   ├── BACKLOG.md                 # Tarefas planeadas
│   ├── EM_PROGRESSO.md            # Work in progress
│   └── CONCLUIDO.md               # Histórico de conclusões
│
├── 📁 06_FERRAMENTAS/             # Documentação específica por ferramenta
│   ├── iaMenu_Core/               # Menu digital
│   ├── GastroLens/                # Análise visual
│   ├── Marketing_Planner/         # Planeamento marketing
│   └── Fichas_Tecnicas/           # Gestão de receitas
│
└── 📁 07_RECURSOS/                # Material de apoio
    ├── REFERENCIAS.md             # Links e recursos externos
    ├── COMPETIDORES.md            # Análise de mercado
    └── INSPIRACAO.md              # Ideias e conceitos
```

---

## 3. FORMATO PADRÃO DE DOCUMENTOS

### Header Obrigatório (Front Matter)
Todos os documentos `.md` devem iniciar com:

```markdown
---
última_atualização: YYYY-MM-DD HH:MM
agent: Claude Code | Gemini | Eurico
versão: X.X
status: Draft | Em Revisão | Aprovado | Implementado | Arquivado
---
```

**Status possíveis:**
- `Draft` - Primeira versão, rascunho
- `Em Revisão` - Aguardando validação
- `Aprovado` - Validado, pronto para implementação
- `Implementado` - Código em produção
- `Arquivado` - Descontinuado ou substituído

---

## 4. CHANGELOG OBRIGATÓRIO

Toda alteração significativa deve ter entrada em `00_META/CHANGELOG.md`:

```markdown
## [YYYY-MM-DD HH:MM]
**Agent:** Claude Code | Gemini | Eurico
**Arquivo:** caminho/do/arquivo.md
**Ação:** Criado | Atualizado | Refatorado | Arquivado
**Resumo:** Descrição concisa do que mudou
**Razão:** Por que foi feito (contexto de negócio/técnico)
**Impacto:** Que outros documentos/código foram afetados
```

---

## 5. WORKFLOW DE TRABALHO

### ANTES de qualquer implementação de código:

- [ ] 1. Documentar decisão em `00_META/DECISOES_ARQUITETURA.md`
- [ ] 2. Atualizar PRD relevante em `02_PRD/`
- [ ] 3. Criar/atualizar tarefas em `05_TAREFAS/EM_PROGRESSO.md`
- [ ] 4. **SÓ DEPOIS:** Escrever código

### APÓS conclusão de tarefa:

- [ ] 1. Mover tarefa de `EM_PROGRESSO.md` → `CONCLUIDO.md`
- [ ] 2. Atualizar `00_META/CHANGELOG.md`
- [ ] 3. Atualizar documentação técnica se aplicável
- [ ] 4. Notificar outro agent (se colaboração ativa)
- [ ] 5. Fazer commit git com mensagem descritiva

---

## 6. BOAS PRÁTICAS

### Clareza > Quantidade
- Documentação deve ser **acionável**, não apenas descritiva
- Use bullets, tabelas, diagramas - evite walls of text
- Cada documento tem um propósito claro

### Versionamento Semântico
- `1.0` - Versão inicial aprovada
- `1.1` - Pequenas adições/correções
- `2.0` - Mudanças significativas de estrutura/conceito

### Links Internos (Obsidian)
Use links internos para conectar conceitos:
- `[[VISAO_ECOSSISTEMA]]` - Link para outro documento
- `[[PRD_GastroLens#Funcionalidades]]` - Link para secção específica

### Templates
Criar templates para documentos recorrentes:
- Template de PRD
- Template de ADR (Architecture Decision Record)
- Template de Tarefa

---

## 7. INTEGRAÇÃO COM CÓDIGO

### Referências Código ↔ Docs
- Em PRDs, referenciar ficheiros de código: `src/components/GastroLens/Scanner.tsx`
- Em código, referenciar PRDs: `// Ver PRD_GastroLens.md - Secção 3.2`

### Sincronização
- Quando código muda significativamente → Atualizar PRD
- Quando PRD muda → Criar issues/tarefas para código

---

## 8. COLABORAÇÃO CLAUDE + GEMINI

### Handoff Protocol
Quando passar trabalho entre agents:

```markdown
## 🔄 HANDOFF PARA [AGENT_NAME]
**Data:** YYYY-MM-DD HH:MM
**Contexto:** O que foi feito até agora
**Próximo Passo:** O que precisa ser feito
**Arquivos Relevantes:** Lista de ficheiros modificados
**Bloqueios:** Dependências ou decisões pendentes
```

### Resolução de Conflitos
Se Claude e Gemini criarem versões diferentes:
1. Preservar ambas as versões com sufixo: `_claude.md` / `_gemini.md`
2. Criar documento `_merge.md` com decisão final
3. Arquivar versões anteriores

---

## 9. REVIEW & AUDIT

### Revisão Semanal
Toda segunda-feira, verificar:
- [ ] CHANGELOG está atualizado?
- [ ] Tarefas em PROGRESSO há mais de 7 dias (possíveis bloqueios)
- [ ] Documentos em `Draft` há mais de 14 dias (validar ou arquivar)

### Audit Trail
Manter rastreabilidade completa:
- Decisão → Documento → Código → Deploy
- Capacidade de voltar atrás e entender **porquê**

---

## 10. REGRAS DE OURO

1. **Documentar ANTES de implementar**
2. **Nunca pular fases do Fluxo da Clareza**
3. **Changelog é sagrado** - sempre atualizar
4. **Status claro** - Draft, Aprovado, Implementado
5. **Um agent, uma voz** - identificar quem fez o quê
6. **Links > Duplicação** - referenciar, não copiar
7. **Pronto é melhor que perfeito** - iterar rapidamente
8. **Código quebrado sem PRD = BLOQUEADO**

---

**Versão:** 1.0
**Responsável:** Claude Code
**Próxima Revisão:** 2025-12-23
