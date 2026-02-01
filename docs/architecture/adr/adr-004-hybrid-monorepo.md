# ADR-004: Estrutura Monorepo Híbrido

## Status

Aceite

## Data

2026-01-31

## Contexto

Precisávamos organizar o código-fonte de múltiplos serviços e o frontend:
- 4 serviços backend Node.js
- 1 frontend React
- Potencial para Java Spring Boot no futuro
- Código partilhado entre serviços
- Simplicidade de gestão de dependências

## Decisão

Adotamos um **monorepo híbrido** com npm workspaces:

```
iamenu-ecosystem/
├── package.json              # Root com workspaces
├── services/
│   ├── community/           # Node.js + TypeScript
│   ├── marketplace/         # Node.js + TypeScript
│   ├── academy/             # Node.js + TypeScript
│   ├── business/            # Node.js + TypeScript
│   └── takeway-proxy/       # Proxy externo
├── frontend/
│   └── apps/
│       └── prototype-vision/ # React + Vite
└── docs/                    # Documentação
```

**npm workspaces** no `package.json` root:
```json
{
  "workspaces": [
    "services/*",
    "frontend/apps/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:community": "npm -w @iamenu/community-api run dev",
    "test": "npm run test --workspaces"
  }
}
```

## Consequências

### Positivas
- **Gestão unificada**: Um `npm install` para tudo
- **Comandos centralizados**: `npm run dev` inicia todos os serviços
- **Versionamento conjunto**: Um repositório, um histórico git
- **Code sharing fácil**: Packages partilhados possíveis
- **Refactoring simplificado**: Mudanças cross-service num PR
- **CI/CD unificado**: Um pipeline para todo o projeto

### Negativas
- **Clone pesado**: Todo o código mesmo para trabalhar num serviço
- **Builds podem ser lentos**: Sem incremental builds nativos
- **Permissões granulares difíceis**: Todos têm acesso a tudo
- **Conflitos de merge**: Mais frequentes com equipas grandes

### Neutras
- Cada serviço mantém o seu próprio `package.json`
- TypeScript config é por serviço
- Testes são executados por workspace

## Alternativas Consideradas

### Polyrepo (Múltiplos Repositórios)
- **Descrição**: Um repositório por serviço
- **Prós**: Isolamento total, permissões granulares, builds independentes
- **Contras**: Sincronização difícil, versioning complexo, PRs separados
- **Razão da rejeição**: Overhead de gestão para equipa pequena

### Monorepo com Nx/Turborepo
- **Descrição**: Ferramentas especializadas para monorepos
- **Prós**: Cache inteligente, builds incrementais, dependency graph
- **Contras**: Complexidade adicional, curva de aprendizagem
- **Razão da rejeição**: npm workspaces suficiente para a escala atual

### Git Submodules
- **Descrição**: Repositórios separados linkados como submodules
- **Prós**: Versionamento independente, repositórios isolados
- **Contras**: Complexidade de gestão, sync issues, UX pobre
- **Razão da rejeição**: Experiência de desenvolvimento degradada

## Evolução Futura

Se a equipa crescer significativamente:
1. Considerar migração para Turborepo (cache de builds)
2. Ou split para polyrepo com tooling de sincronização

## Referências

- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Monorepo vs Polyrepo](https://www.atlassian.com/git/tutorials/monorepos)
