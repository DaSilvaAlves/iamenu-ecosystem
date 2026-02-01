# ADR-002: Base de Dados Única com Multi-Schema

## Status

Aceite

## Data

2026-01-31

## Contexto

Com 4 microserviços independentes, precisávamos decidir a estratégia de base de dados:
- Cada serviço precisa de persistência de dados
- Alguns dados são partilhados (userId referenciado em todos os serviços)
- Queremos manter isolamento entre domínios
- Recursos de infraestrutura são limitados na fase inicial

## Decisão

Adotamos uma **base de dados PostgreSQL única** com **schemas separados por serviço**:

```sql
-- Uma base de dados: iamenu
-- Quatro schemas:
CREATE SCHEMA community;   -- 14 modelos
CREATE SCHEMA marketplace; -- 10 modelos
CREATE SCHEMA academy;     -- 5 modelos
CREATE SCHEMA business;    -- 6 modelos
```

Configuração Prisma com `multiSchema`:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["community"]
}
```

Conexão via URL com schema:
```
DATABASE_URL=postgresql://user:pass@host:5432/iamenu?schema=community
```

## Consequências

### Positivas
- **Custo reduzido**: Uma única instância PostgreSQL
- **Isolamento lógico**: Schemas separados evitam conflitos de nomes
- **Simplicidade operacional**: Um backup, uma conexão, um upgrade
- **Queries cross-schema possíveis**: Se necessário no futuro (via SQL raw)
- **Migrations independentes**: Cada serviço gere as suas migrations

### Negativas
- **Acoplamento de infraestrutura**: Falha no DB afeta todos os serviços
- **Escalabilidade limitada**: Não podemos escalar DBs independentemente
- **Sem foreign keys cross-schema**: Referências por userId são lógicas, não físicas
- **Contenção de recursos**: Serviços competem pelos mesmos recursos de DB

### Neutras
- Prisma gere o schema automaticamente
- Cada serviço tem o seu próprio `prisma/schema.prisma`
- Migrations são aplicadas por serviço

## Alternativas Consideradas

### Database per Service
- **Descrição**: Uma instância PostgreSQL por serviço
- **Prós**: Isolamento total, escalabilidade independente
- **Contras**: Custo 4x maior, complexidade operacional, sem joins
- **Razão da rejeição**: Custo proibitivo na fase inicial

### Base de Dados Partilhada (sem schemas)
- **Descrição**: Todas as tabelas no schema public
- **Prós**: Simplicidade, foreign keys possíveis
- **Contras**: Conflitos de nomes, acoplamento forte, migrations complexas
- **Razão da rejeição**: Violaria princípios de microserviços

### MongoDB (NoSQL)
- **Descrição**: Collections separadas por serviço
- **Prós**: Flexibilidade de schema, escalabilidade horizontal
- **Contras**: Sem transações ACID robustas, curva de aprendizagem
- **Razão da rejeição**: Dados relacionais beneficiam de SQL

## Migração Futura

Se necessário escalar, podemos migrar para database-per-service:
1. Exportar schema específico
2. Criar nova instância PostgreSQL
3. Atualizar DATABASE_URL do serviço
4. Minimal code changes (apenas connection string)

## Referências

- [Prisma Multi-Schema](https://www.prisma.io/docs/concepts/components/prisma-schema/postgresql#multi-schema-support)
- [PostgreSQL Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html)
