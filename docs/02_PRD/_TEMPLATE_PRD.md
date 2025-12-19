---
última_atualização: YYYY-MM-DD HH:MM
agent: Claude Code | Gemini | Eurico
versão: 1.0
status: Draft | Em Revisão | Aprovado | Implementado
---

# PRD: [NOME DA FERRAMENTA]

> **Metodologia:** "Do Puxadinho à Mansão" - Fase 2: Detalhamento (70% Humano / 30% IA)
> **Objetivo:** Transformar briefing em documento técnico executável

---

## 📋 METADATA

| Campo | Valor |
|-------|-------|
| **Ferramenta** | [Nome] |
| **Cluster** | Gestão Operacional / Marketing / Formação / Comunidade |
| **Prioridade** | 🔴 Crítica / 🟡 Alta / 🟢 Média / ⚪ Baixa |
| **Fase Roadmap** | Fase 1 (MVP) / Fase 2 / Fase 3 / Fase 4 |
| **Responsável** | Eurico / Claude / Gemini |
| **Timeline Estimado** | X semanas |
| **Dependências** | [Outras ferramentas/sistemas] |

---

## 1️⃣ CONTEXTO E PROBLEMA

### Dor Principal (Pain Point)
**Qual é a dor ESPECÍFICA que esta ferramenta resolve?**

[Descrever a dor com dados concretos da pesquisa de mercado]

**Fonte:** [[07_RECURSOS/PESQUISA_MERCADO_2025]]

### Quem Sofre Esta Dor?
- [ ] **Empresário/Dono** - [Como afeta]
- [ ] **Staff** - [Como afeta]
- [ ] **Cliente Final** - [Como afeta]

### Impacto da Dor (Custo Atual)
**Quanto custa NÃO ter esta ferramenta?**
- **Financeiro:** €X/mês perdidos
- **Tempo:** Xh/mês desperdiçadas
- **Qualidade:** [Impacto na experiência]
- **Estratégico:** [Oportunidades perdidas]

### Por Que Resolver AGORA?
- [ ] Dor crítica identificada na pesquisa
- [ ] ROI demonstrável rapidamente
- [ ] Diferencial competitivo
- [ ] Pré-requisito para outras ferramentas
- [ ] Outro: [especificar]

---

## 2️⃣ OBJETIVOS E CONTEXTO

### Objetivos de Negócio
**O que queremos alcançar?**

1. **Objetivo Primário:** [Ex: Reduzir desperdício em 30%]
2. **Objetivo Secundário:** [Ex: Aumentar eficiência staff]
3. **Objetivo Terciário:** [Ex: Melhorar satisfação cliente]

### Objetivos de Produto
**O que o produto deve fazer?**

- [ ] [Funcionalidade core #1]
- [ ] [Funcionalidade core #2]
- [ ] [Funcionalidade core #3]

### Escopo (O Que É e O Que NÃO É)

**✅ ESTA FERRAMENTA É:**
- [Item 1]
- [Item 2]
- [Item 3]

**❌ ESTA FERRAMENTA NÃO É:**
- [Anti-feature 1 - deliberadamente excluída]
- [Anti-feature 2]
- [Anti-feature 3]

**Linha de Corte:**
[Onde traçamos a linha? O que fica de fora de propósito?]

---

## 3️⃣ PERSONAS E CASOS DE USO

### Persona Principal
**Nome:** [Ex: "Pedro, Dono de Tasca no Porto"]
**Perfil:**
- Idade negócio: X anos
- Tamanho: X lugares
- Faturação: €X/ano
- Nível tech: Básico / Intermédio / Avançado
- Dor #1: [Principal dor]

**Cenário Típico:**
```
Segunda-feira, 9h da manhã:
Pedro abre o restaurante e precisa [ação].
Sem a ferramenta: [o que acontece - negativo]
Com a ferramenta: [o que acontece - positivo]
Resultado: [impacto mensurável]
```

### Personas Secundárias
[Se aplicável]

---

## 4️⃣ JORNADA DO UTILIZADOR

### Fluxo Principal (Happy Path)

```
1. Utilizador acede à ferramenta
   ↓
2. [Ação específica]
   ↓
3. Sistema processa
   ↓
4. Utilizador vê resultado
   ↓
5. Toma decisão/ação
   ↓
6. Outcome positivo
```

### Fluxos Alternativos
**Erro / Caminho Alternativo #1:**
- Trigger: [O que desencadeia]
- Ação: [O que acontece]
- Resolução: [Como resolver]

### Estados do Sistema
- [ ] **Primeira utilização** (onboarding)
- [ ] **Uso regular** (dia-a-dia)
- [ ] **Estado vazio** (sem dados)
- [ ] **Estado com dados** (normal)
- [ ] **Estado de erro** (falha)

---

## 5️⃣ REQUISITOS FUNCIONAIS

### Features Core (MVP - Mínimo Viável)

#### Feature 1: [Nome]
**Descrição:** [O que faz]
**Prioridade:** 🔴 Must-have / 🟡 Should-have / 🟢 Nice-to-have

**Critérios de Aceitação:**
- [ ] Dado [contexto]
- [ ] Quando [ação]
- [ ] Então [resultado esperado]

**User Stories:**
- Como [persona], quero [ação] para [benefício]

---

#### Feature 2: [Nome]
[Repetir estrutura acima]

---

### Features Futuras (Post-MVP)
[Features que ficam para Fase 2/3]

---

## 6️⃣ REQUISITOS NÃO-FUNCIONAIS

### Performance
- [ ] Tempo resposta < Xs
- [ ] Suporta X utilizadores simultâneos
- [ ] Uptime > 99.X%

### Usabilidade
- [ ] Onboarding < X minutos
- [ ] Interface intuitiva (sem manual)
- [ ] Responsivo (mobile + desktop)
- [ ] Acessibilidade WCAG 2.1 AA

### Segurança
- [ ] Autenticação/Autorização
- [ ] Encriptação dados sensíveis
- [ ] GDPR compliance
- [ ] Backup automático

### Escalabilidade
- [ ] Suporta crescimento até X restaurantes
- [ ] Arquitetura modular
- [ ] APIs documentadas

### Integrações
- [ ] Integra com [Sistema X]
- [ ] API REST disponível
- [ ] Webhooks para eventos

---

## 7️⃣ DESIGN E UX

### Princípios de Design
1. **Simplicidade:** [Como aplicar]
2. **Clareza:** [Como aplicar]
3. **Feedback Imediato:** [Como aplicar]

### Wireframes / Mockups
[Link para Figma / Sketches]

**Ecrãs Principais:**
1. Ecrã Inicial / Dashboard
2. Ecrã Principal da Feature
3. Ecrã de Configurações
4. Ecrã de Resultados/Analytics

### Fluxo Visual
```
[Diagrama ou descrição do fluxo de ecrãs]
```

### Mobile-First
- [ ] Design adaptado para smartphone
- [ ] Touch-friendly (botões grandes)
- [ ] Funciona offline? (PWA)

---

## 8️⃣ DADOS E ANALYTICS

### Dados que a Ferramenta Recolhe
| Dado | Tipo | Propósito | Sensível? |
|------|------|-----------|-----------|
| [Ex: Email user] | String | Autenticação | ✅ Sim |
| [Ex: Vendas/dia] | Number | Analytics | ❌ Não |

### Dados que a Ferramenta Gera
[Output da ferramenta]

### Métricas de Sucesso (KPIs)

**Métricas de Produto:**
- [ ] X% utilizadores ativos diariamente
- [ ] Tempo médio sessão > Xmin
- [ ] Taxa conclusão onboarding > X%

**Métricas de Negócio:**
- [ ] ROI: Utilizador economiza €X/mês
- [ ] Retenção: X% renovam subscrição
- [ ] NPS: > X pontos

**Métricas de Impacto:**
- [ ] Redução desperdício: X%
- [ ] Aumento eficiência: Xh/mês poupadas
- [ ] Melhoria satisfação: +X pontos reviews

---

## 9️⃣ ARQUITETURA TÉCNICA

### Stack Tecnológico Proposto
**Frontend:**
- [ ] Framework: [React / Vue / Next.js]
- [ ] UI Library: [Tailwind / MUI / Chakra]
- [ ] State Management: [Redux / Zustand / Context]

**Backend:**
- [ ] Runtime: [Node / Python / Go]
- [ ] Framework: [Express / FastAPI / Gin]
- [ ] Base Dados: [PostgreSQL / MongoDB / Supabase]

**IA/ML:**
- [ ] Modelo: [OpenAI / Claude / Gemini / Custom]
- [ ] Use Case: [Geração conteúdo / Análise / Previsão]

**Hosting:**
- [ ] [Vercel / AWS / Railway / Supabase]

### Diagrama de Arquitetura
```
[Cliente] → [Frontend] → [API] → [Backend] → [Base Dados]
                ↓                     ↓
            [IA Service]         [External APIs]
```

### Integrações Necessárias
- [ ] iaMenu Core (menu digital)
- [ ] Sistema POS (se aplicável)
- [ ] APIs externas: [listar]

### Modelo de Dados (Simplificado)
```sql
-- Exemplo
TABLE users (
  id UUID PRIMARY KEY,
  email STRING UNIQUE,
  restaurant_id UUID REFERENCES restaurants(id),
  created_at TIMESTAMP
)

TABLE [entidade_principal] (
  ...
)
```

---

## 🔟 IMPLEMENTAÇÃO

### Faseamento

**FASE 1: Core Functionality (Semana 1-2)**
- [ ] Setup projeto
- [ ] Autenticação básica
- [ ] Feature core #1
- [ ] Testes unitários

**FASE 2: Features Adicionais (Semana 3-4)**
- [ ] Feature core #2
- [ ] Feature core #3
- [ ] Integração com iaMenu Core

**FASE 3: Polish & Deploy (Semana 5-6)**
- [ ] UX refinements
- [ ] Testes E2E
- [ ] Deploy staging
- [ ] Beta com 3-5 restaurantes piloto

**FASE 4: Iteração (Semana 7+)**
- [ ] Feedback utilizadores
- [ ] Ajustes baseados em dados
- [ ] Deploy produção

### Dependências e Bloqueadores
**Dependências:**
- [ ] [Sistema X] precisa estar implementado
- [ ] [Decisão Y] precisa ser tomada

**Riscos:**
- [ ] [Risco técnico] - Mitigação: [como resolver]
- [ ] [Risco negócio] - Mitigação: [como resolver]

### Recursos Necessários
**Desenvolvimento:**
- [ ] X dias Claude Code
- [ ] X dias Gemini
- [ ] X dias Eurico (validação)

**Externos:**
- [ ] API keys: [listar]
- [ ] Custos mensais: €X

---

## 1️⃣1️⃣ GO-TO-MARKET

### Estratégia de Lançamento

**Beta Fechado:**
- 3-5 restaurantes piloto
- Onboarding manual e próximo
- Feedback semanal
- Duração: 4 semanas

**Critérios de Sucesso Beta:**
- [ ] X% utilizadores ativos diários
- [ ] NPS > X
- [ ] 0 bugs críticos
- [ ] ROI demonstrável (€X economizado)

**Lançamento Público:**
- Após validação beta
- Comunicação: [canais]
- Preço: [modelo]

### Pricing (se aplicável)
- [ ] **Freemium:** [Limites versão grátis]
- [ ] **Pro:** €X/mês - [Features adicionais]
- [ ] **Enterprise:** Custom - [Para cadeias]

### Onboarding
**Novo Utilizador:**
1. Registo (< 2min)
2. Tour guiado interativo (< 5min)
3. Primeira ação incentivada
4. Quick win garantido (< 10min)

---

## 1️⃣2️⃣ SUPORTE E DOCUMENTAÇÃO

### Documentação Utilizador
- [ ] Guia rápido (PDF / vídeo 3min)
- [ ] FAQ
- [ ] Tutoriais vídeo (YouTube)
- [ ] Base conhecimento (Notion / Help Scout)

### Suporte Técnico
- [ ] Email: suporte@iamenu.pt
- [ ] Chat in-app (Intercom / Crisp)
- [ ] WhatsApp Business (horário X)
- [ ] SLA: resposta < Xh

### Formação
- [ ] Webinar onboarding semanal
- [ ] Curso Academia iaMenu relacionado
- [ ] 1-on-1 para clientes Enterprise

---

## 1️⃣3️⃣ CRITÉRIOS DE APROVAÇÃO

### Checklist Pré-Desenvolvimento
- [ ] PRD aprovado por Eurico
- [ ] Wireframes validados
- [ ] Stack técnico decidido
- [ ] Integrações mapeadas
- [ ] Métricas de sucesso definidas

### Definition of Done (DoD)
- [ ] Todos requisitos funcionais implementados
- [ ] Testes unitários > 80% coverage
- [ ] Testes E2E dos fluxos principais
- [ ] Documentação utilizador completa
- [ ] Performance requirements atingidos
- [ ] Segurança auditada
- [ ] Deploy staging funcional
- [ ] Aprovação Eurico

---

## 1️⃣4️⃣ ANEXOS

### Referências
- [[07_RECURSOS/PESQUISA_MERCADO_2025]] - Dados de mercado
- [[01_BRIEFING/BRIEFING_COMPLETO]] - Contexto geral
- [[03_ARQUITETURA/STACK_TECNICO]] - Stack atual

### Competidores / Inspiração
| Produto | Feature Interessante | Diferencial iaMenu |
|---------|---------------------|-------------------|
| [Nome] | [Feature] | [Como fazemos melhor] |

### Mockups / Designs
[Links para Figma / imagens]

---

## 📝 HISTÓRICO DE VERSÕES

| Versão | Data | Agent | Mudanças |
|--------|------|-------|----------|
| 1.0 | YYYY-MM-DD | Claude | Criação inicial PRD |
| 1.1 | YYYY-MM-DD | Eurico | Validação e ajustes |
| 2.0 | YYYY-MM-DD | Gemini | Refinamento técnico |

---

**Status:** Draft
**Próximo Passo:** Validação com Eurico
**Responsável Atual:** [Nome]
