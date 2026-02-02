# Source Tree - iaMenu Ecosystem

## Estrutura Raiz

```
iamenu-ecosystem/
├── .aios-core/              # Sistema AIOS (agentes IA)
├── .claude/                 # Configuração Claude Code
├── .github/                 # GitHub workflows
├── docs/                    # Documentação
├── frontend/                # Aplicações frontend
├── services/                # Microserviços backend
├── docker-compose.yml       # Orquestração Docker
├── package.json             # Workspaces npm
└── README.md                # Documentação principal
```

## Services (Backend)

```
services/
├── community/               # Porta 3001 - Hub da Comunidade
│   ├── prisma/
│   │   └── schema.prisma    # 16 modelos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── marketplace/             # Porta 3002 - Marketplace
│   ├── prisma/
│   │   └── schema.prisma    # 10 modelos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── academy/                 # Porta 3003 - Academia
│   ├── prisma/
│   │   └── schema.prisma    # 5 modelos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
├── business/                # Porta 3004 - Business Intelligence
│   ├── prisma/
│   │   └── schema.prisma    # 6 modelos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
└── takeway-proxy/           # Proxy externo
```

## Frontend

```
frontend/
├── apps/
│   └── prototype-vision/    # App principal React
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── views/       # 41+ vistas
│       │   ├── config/      # Configurações API
│       │   ├── hooks/       # Custom hooks
│       │   └── App.jsx
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
└── packages/                # Packages partilhados (futuro)
    ├── ui/
    └── utils/
```

## Documentação

```
docs/
├── architecture/            # Documentação de arquitetura
│   ├── codebase-discovery-*.md
│   └── adr/                 # Architecture Decision Records
├── analytics/               # Análise e métricas
├── design/                  # UX/UI Design
├── framework/               # Padrões do projeto
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── source-tree.md
├── handoffs/                # Handoffs de sessões
├── qa/                      # Quality Assurance
└── stories/                 # User Stories
```

## AIOS System

```
.aios-core/
├── core/                    # Core do sistema
│   ├── elicitation/         # Motor de elicitação
│   ├── config/              # Configurações
│   └── session/             # Gestão de sessões
├── development/
│   ├── agents/              # 12 definições de agentes
│   ├── scripts/             # Scripts de desenvolvimento
│   ├── tasks/               # Tarefas executáveis
│   ├── templates/           # Templates de documentos
│   ├── workflows/           # Workflows automatizados
│   └── checklists/          # Checklists de validação
├── infrastructure/
│   └── scripts/             # 80+ scripts de infraestrutura
├── data/                    # Dados e configurações
├── cli/                     # Interface de linha de comando
├── index.js                 # Entry point CommonJS
├── index.esm.js             # Entry point ES Modules
└── core-config.yaml         # Configuração principal
```

## Configuração Claude Code

```
.claude/
├── CLAUDE.md                # Guidelines do projeto
├── commands/
│   └── AIOS/
│       └── agents/          # Skills dos agentes
├── rules/                   # Regras específicas
│   └── mcp-usage.md
└── settings.json            # Configurações
```

## Base de Dados (38 modelos)

| Schema | Modelos | Descrição |
|--------|---------|-----------|
| community | 16 | Posts, Grupos, Perfis, Gamificação, Moderação |
| marketplace | 10 | Fornecedores, Produtos, Cotações, Negociações |
| academy | 5 | Cursos, Módulos, Lições, Certificados |
| business | 6 | Restaurantes, Encomendas, Estatísticas |
