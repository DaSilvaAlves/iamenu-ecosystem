---
última_atualização: 2025-12-16 22:15
agent: Claude Code
versão: 1.0
status: Aguardando Respostas Eurico
---

# 5 PERGUNTAS CRÍTICAS ANTES DOS PRDs

> **Contexto:** Antes de criar PRDs detalhados, precisamos de clareza sobre pontos fundamentais
> **Metodologia:** "Do Puxadinho à Mansão" - Não pular fases!

---

## ❓ PERGUNTA 1: STACK TÉCNICO ATUAL

### O que precisamos saber:
**Qual é a stack tecnológica do iaMenu Core (que já funciona)?**

Por favor, preenche:

**Frontend:**
- [ ] Framework: React / Vue / Next.js / Outro: _______
- [ ] Linguagem: TypeScript / JavaScript
- [ ] UI Library: Tailwind / MUI / Chakra / Bootstrap / Custom
- [ ] Hosting: Vercel / Netlify / AWS / Outro: _______

**Backend:**
- [ ] Linguagem/Runtime: Node.js / Python / Go / PHP / Outro: _______
- [ ] Framework: Express / NestJS / FastAPI / Django / Outro: _______
- [ ] Base de Dados: PostgreSQL / MySQL / MongoDB / Supabase / Firebase / Outro: _______
- [ ] ORM: Prisma / TypeORM / Sequelize / SQLAlchemy / Outro: _______
- [ ] Hosting: Railway / AWS / Google Cloud / Outro: _______

**IA:**
- [ ] Provider: OpenAI / Claude (Anthropic) / Gemini (Google) / Outro: _______
- [ ] Modelos usados: GPT-4 / Claude Sonnet / Gemini Pro / Outro: _______
- [ ] Como integras: API direta / SDK / LangChain / Outro: _______

**Autenticação:**
- [ ] Sistema: Supabase Auth / Auth0 / Firebase Auth / Custom / Outro: _______

**Pagamentos:**
- [x] Gateway: Stripe / PayPal / MB Way direto / Outro: _______

**Por que isto é crítico?**
→ Ferramentas novas devem usar a MESMA stack para:
- Facilitar manutenção
- Reutilizar componentes
- Dados partilhados (mesma BD)
- Um login para tudo

---

## ❓ PERGUNTA 2: MODELO DE PREÇOS & MONETIZAÇÃO

### O que precisamos saber:
**Como vais monetizar o ecossistema?**
# Planos criados para os restaurantes 
![[{91AFC652-E7F7-455E-BD37-869ECEA8BF7F}.png]]

Na fase de lançamento e para nos diferenciarmos do mercado os planos vão ser 
30 dias free para testar 

O PLANOS TEM ACESSO A TODAS AS FERRAMENTAS E COMUNIDADE
###### 💎 MENU DIGITAL IA

- ✅ Menu Multilíngue (6 idiomas)
- ✅ QR Code
- ✅ Chat IA
- ✅ Carrinho Pedidos

 ###### 💎 MENU DIGITAL IA ###### BASIC
 PREÇO DE LANÇAMENTO
€88/mês
- ✅ Menu Multilíngue (6 idiomas)
- ✅ QR Code
- ✅ Chat IA
- ✅ Carrinho Pedidos

### PRO ⭐

(EM DESENVOLVIMENTO)
###### PREÇO DE LANÇAMENTO
€188/mês
###### 💎 MENU DIGITAL IA

- ✅ Menu Multilíngue (6 idiomas)
- ✅ QR Code
- ✅ Chat IA
- ✅ Carrinho Pedidos

###### 💳 PAGAMENTOS & INTEGRAÇÃO

- ✅ Pagamentos Integrados  
    (MB Way, Multibanco)
- ✅ Envio Automático POS
- ✅ Sincronização Tempo Real  
    (produtos/preços)

Escolhe um modelo (ou combinação): 
### Opção A: Freemium
```
GRÁTIS:
- Menu Digital básico
- [30 dias] 

PAGO (€0/mês):
- Todas as ferramentas
- Suporte prioritário
- Academia ilimitada
```

### Opção B: Tudo Pago desde Início
```
STARTER (€X/mês):
- Menu Digital
- Dashboard BI básico
- 1 restaurante

PRO (€X/mês):
- Tudo do Starter
- Marketing Planner
- Fichas Técnicas
- Academia
- 

ENTERPRISE (€X/mês):
- Tudo ilimitado
- Suporte dedicado
- Múltiplos restaurantes
```

### Opção C: À La Carte
```
Menu Digital: €X/mês
Marketing Planner: €Y/mês
Academia: €Z/mês
...
```

**Tua escolha:** _____________

**Preço que tens em mente (€/mês por restaurante):** _____________

**Trial gratuito?**
- [x] Sim, 30 dias
- [ ] Não, só demo

**Por que isto é crítico?**
→ Pricing afeta arquitetura (paywall, feature flags, usage limits)

---

## ❓ PERGUNTA 3: CLIENTE IDEAL (PERSONA ESPECÍFICA)

### O que precisamos saber:
**Descreve 1 restaurante REAL (ou tipo muito específico) que é o teu cliente ideal**

Por favor, seja o mais específico possível:

**Nome/Tipo:**
[Ex: "REST. Sanak Bar Alturense, 120 lugares, 7 anos de atividade"]

**Perfil:**
- **Localização:** Altura , Algarve ____________
- **Tamanho:**120 lugares
- **Tipo cozinha:** Tradicional / 
- **Faturação aprox:** < €100k / €100-500k / €500k-1M / > €1M ano
- **Turistas vs Locais:** _70__% turistas / _30__% locais
- **Nível tech atual:**
  - [x] Papel e caneta (zero tech)
  - [x] Usa redes sociais mas pouco mais
  - [x] Tem POS básico mas processos manuais
  - [ ] Relativamente digitalizado

**Dor principal dele:**
_____________________________________________

**Quanto está disposto pagar/mês por solução:**
€ _88______

**Como descobriu o iaMenu:**
- [ ] Google
- [x] Recomendação amigo
- [ ] Redes sociais
- [ ] Evento/feira
- [x] Outro: _______

**Por que isto é crítico?**
→ PRDs devem resolver dores DESTA pessoa específica, não "restaurantes em geral"

---

## ❓ PERGUNTA 4: PRIORIDADE #1 (SE TIVESSES QUE ESCOLHER APENAS 1)

### O que precisamos saber:
**Se pudesses lançar APENAS 1 ferramenta nos próximos 3 meses, qual seria?**

Escolhe UMA:

- [ ] **Marketing Planner**
  - Razão: _______________________

- [ ] **Fichas Técnicas / Food Cost**
  - Razão: _______________________

- [ ] **Academia (3 cursos)**
  - Razão: criar _______________________

- [ ] **Gestão de Equipas**
  - Razão: _______________________

- [ ] **Inventário Inteligente**
  - Razão: _______________________

- [ ] **Outra:** ___CLUSTER 4: COMUNIDADE E NETWORKING 9. Hub de Comunidade iaMenu Dor Resolvida: • Isolamento dos empresários • Falta de partilha de melhores práticas • Dificuldade em encontrar soluções para problemas comuns Funcionalidades: • Fórum exclusivo para membros iaMenu • Grupos temáticos (sustentabilidade, marketing, RH) • Webinars mensais com especialistas • Biblioteca de cases de sucesso • Networking presencial (eventos trimestrais) • Programa de mentoria entre pares Valor para o Cliente: ○ Apoio e suporte de uma comunidade ○ Acesso a conhecimento coletivo ○ Oportunidades de parcerias e colaborações ○ Sensação de pertença 10. Marketplace de Fornecedores Dor Resolvida: • Dificuldade em encontrar fornecedores de qualidade • Negociação individual com baixo poder de compra • Falta de transparência sobre origem de produtos Funcionalidades: • Diretório de fornecedores verificados • Reviews e ratings de outros restauradores • Negociação coletiva (descontos por volume agregado) • Comparação de preços e condições • Pedidos online integrados com inventário Valor para o Cliente: ○ Redução de custos de compras ○ Acesso a fornecedores de confiança ○ Poder de negociação aumentado ○ Simplificação do processo de compra________
  - Razão: _______________________

**Segunda prioridade (se der tempo):** _______

**Por que isto é crítico?**
→ Com €0 capital e equipa solo, precisamos focar. Melhor 1 ferramenta excelente que 5 medianas.

---

## ❓ PERGUNTA 5: VISÃO DE SUCESSO (6 MESES)

### O que precisamos saber:
**Daqui a 6 meses (Junho 2026), como é o sucesso?**

Por favor, preenche com NÚMEROS específicos:

**Clientes:**
- _____ restaurantes ativos pagantes
- _____ taxa retenção (% que renovam)

**Receita:**
- €__10___ MRR (Monthly Recurring Revenue)
- €_____ receita total 6 meses

**Produto:**
- _____ ferramentas lançadas e estáveis
- _____ cursos Academia disponíveis
- _____ bugs críticos (ideal: 0)

**Impacto:**
- Cada restaurante economiza €_____ /mês (demonstrável)
- NPS (Net Promoter Score) > _____ pontos
- _____ reviews positivas (Google/Facebook)

**Equipa:**
- Ainda solo ou já contrataste alguém?
- Se sim, quem? (dev / marketing / suporte)

**Por que isto é crítico?**
→ PRDs devem ter métricas alinhadas com esta visão

---

## ✅ QUANDO TIVERES RESPONDIDO...

**Próximo Passo Automático:**
Podemos criar PRDs completos para:

1. **Marketing Planner Automático** (prioridade identificada)
2. **Academia iaMenu** (3 cursos piloto alinhados com ferramentas)
3. **Hub Comunidade** (versão básica para começar networking)

E depois (Fase 2):
4. Fichas Técnicas / Food Cost (refatoração)
5. Gestão de Equipas
6. Inventário Inteligente

---

## 🎯 BONUS: SE QUISERES ACELERAR

**Podes já partilhar:**

📂 **Acesso ao código iaMenu Core atual?**
- GitHub repo (privado, adicionar Claude Code como colaborador)
- Ou: ZIP do código
- Ou: Screenshots arquitetura

📊 **Analytics atuais?**
- Quantos users tens agora?
- Quantos restaurantes?
- Dados de uso?

🎨 **Design system / Brand guidelines?**
- Cores
- Tipografia
- Logos
- Estilo visual

Isto acelera MUITO a criação dos PRDs porque podemos ser específicos sobre integração.

---

**Status:** Aguardando respostas de Eurico
**Tempo estimado para responder:** 15-20 minutos
**Próximo passo:** Criar PRDs detalhados com estas respostas
