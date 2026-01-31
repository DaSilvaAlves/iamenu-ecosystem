## PRD (Product Requirements Document) - Gestor de Reputação Online (para Restaurantes)

**Versão:** 1.0 (Refinada - Abordagem "Mansão")
**Data:** 26 de janeiro de 2026
**Autor Original:** Eurico José da Silva Alves
**Refinado por:** Agente `@pm` Morgan, orquestrado por `@aios-master` Orion (com inputs de `@analyst` Atlas, `@architect` Aria, `@po` Pax)

---

## **1. Visão e Enquadramento - Elevando à Categoria 'Mansão'**

**Produto:** Gestor de Reputação Online (para restaurantes)
**Tipo:** Módulo SaaS focado em reviews e feedback de clientes. Integrável ao ecossistema iaMenu.

**Problema a Resolver (Ainda mais claro):**

*   **Gestão Ineficaz de Reviews:** Avaliações negativas sem resposta ou com respostas tardias/inadequadas, impactando diretamente a perceção pública e a fidelização de clientes.
*   **Sobrecarga Operacional:** Donos/gestores de restaurantes, com tempo limitado, não conseguem monitorizar múltiplas plataformas de feedback diariamente.
*   **Feedback Não Acionável:** A falta de sistematização impede a transformação de feedback valioso em decisões estratégicas para melhoria contínua de serviço, formação, menu e processos.

**Visão (Consolidada - A "Central de Reputação Inteligente"):**
Ser a "central de reputação inteligente" do restaurante: uma caixa única e preditiva onde convergem reviews públicas e feedback privado. Através de sugestões de resposta assistidas por IA (com "voz" configurável) e insights acionáveis baseados em análise de sentimento e temas, o produto capacita gestores a melhorar proactivamente a experiência do cliente, otimizar operações e, consequentemente, impulsionar a faturação e a lealdade, posicionando-se como um pilar estratégico no ecossistema iaMenu.

---

## **2. Objetivos e Métricas de Sucesso - Metas de uma 'Mansão'**

**Objetivos de Negócio (12 meses):**

1.  **Aumento da Taxa de Resposta:** Atingir e manter >90% de reviews respondidas. **Métrica de Sucesso:** `(Nº Reviews Respondidas / Nº Total de Reviews) > 90%`.
2.  **Otimização do Tempo de Resposta:** Reduzir o tempo médio de resposta para <24h. **Métrica de Sucesso:** `Tempo Médio de Resposta < 24 horas`.
3.  **Melhoria Contínua da Reputação:** Melhoria média de +0.3 pontos na nota das plataformas (6–12 meses de uso consistente). **Métrica de Sucesso:** `(Nota Pós-Implementação - Nota Pré-Implementação) > 0.3`.
4.  **Identificação e Resolução de Problemas:** Aumentar em 50% a identificação e categorização de problemas recorrentes, resultando em pelo menos 2 ações corretivas documentadas por trimestre. **Métrica de Sucesso:** `Nº de Problemas Recorrentes Tagados e Ações Corretivas por Trimestre`.

**KPIs Principais:**

*   **Performance da Resposta:** % de reviews respondidas (por período e por plataforma), Tempo médio de resposta.
*   **Impacto na Reputação:** Nota média por plataforma (antes/depois), Variação da nota média.
*   **Feedback Acionável:** Nº de problemas recorrentes identificados e resolvidos (tagados no sistema), Nº de sugestões de formação/ajuste de menu geradas pela IA e aceites/implementadas pelo gestor.
*   **Adoção:** Nº de donos/gestores que configuram a "voz" do restaurante; % de uso das respostas sugeridas por IA.

---

## **3. Público-Alvo e Persona - Foco no Dono Estratégico**

**Restaurantes Alvo:**

*   Restaurantes independentes e pequenos grupos (1-5 unidades), dark kitchens e conceitos de take-away/delivery com marca própria.
*   Já com presença ativa em pelo menos 2-3 plataformas de reviews digitais (Google Business Profile, TripAdvisor, Facebook, Instagram Comments, Uber Eats/Glovo).

**Persona Principal: Dono/Gestor "Estrategista Atarefado"**

*   **Demografia:** 30–55 anos, lidera a operação diária, mas com visão de crescimento.
*   **Problema:** Reconhece a importância vital das reviews, mas a gestão reativa e manual consome tempo precioso e impede uma análise estratégica. Evita a "vergonha" pública, mas busca proativamente o feedback para otimizar processos, treinar equipas e inovar no menu.
*   **Objetivo:** Quer uma ferramenta que automatize a monitorização e a resposta inicial, mas que acima de tudo transforme o "ruído" das reviews em **inteligência de negócio** acionável, conectando pontos entre feedback, operação e resultados financeiros (visando integração futura com BI do iaMenu).

---

## **4. Escopo Funcional (MVP) - Épicos para uma 'Mansão'**

A seção de escopo funcional do MVP será reestruturada em Épicos e User Stories, seguindo uma abordagem modular para garantir a escalabilidade e evitar o "puxadinho".

### **Épico 1: Módulo de Ingestão de Dados e Inbox Unificada (Foundation)**

**Objetivo:** Centralizar todas as fontes de feedback num único local acessível, facilitando a monitorização e a gestão.

**User Stories:**

*   **Story 1.1: Conexão com Plataformas Core**
    *   **Descrição:** Como gestor de restaurante, quero que o sistema se conecte com o Google Business Profile e o TripAdvisor para importar automaticamente reviews.
    *   **Critério de Aceitação:** Uma review publicada no Google Business ou TripAdvisor aparece na inbox unificada em até [X] minutos (pesquisa: `@analyst` Atlas definirá `X` conforme limitações técnicas das APIs).
    *   **Pesquisa Crítica (Input de `@analyst` Atlas):** `@pm` Morgan, confirme as limitações da API sobre a possibilidade de **publicação direta de respostas** nessas plataformas para informar o escopo da Story 2.1.
*   **Story 1.2: Importação e Normalização de Dados de Review**
    *   **Descrição:** Como gestor, quero que o sistema importe automaticamente o rating (1-5 estrelas), texto da review, data/hora e plataforma de origem, e os exiba de forma padronizada.
    *   **Critério de Aceitação:** Todas as reviews importadas exibem consistentemente os campos `rating`, `review_text`, `review_date`, `source_platform`.
    *   **Decisão de Design (Input de `@pm` Morgan):** `review_text` deve ser armazenado em seu idioma original e, se aplicável, com tradução automática opcional (Fase 2).
*   **Story 1.3: Visualização e Filtragem Avançada da Inbox**
    *   **Descrição:** Como gestor, quero visualizar todas as reviews numa lista unificada e filtrá-las facilmente por plataforma, rating (negativas 1-3 / positivas 4-5) e estado ("sem resposta", "respondida").
    *   **Critério de Aceitação:** Consigo listar apenas reviews negativas pendentes de resposta com no máximo 2 cliques.
    *   **Decisão de Design (Input de `@pm` Morgan):** Reviews com rating de 1 a 3 estrelas devem **brilhar em vermelho** ou ter um destaque visual forte na inbox. Para reviews sem resposta, deve ser exibido um **cronómetro em contagem decrescente de 24 horas**, visualmente proeminente, alertando sobre o tempo de resposta.

### **Épico 2: Módulo de Resposta Assistida por IA (Intelligent Engagement)**

**Objetivo:** Capacitar o gestor a responder reviews de forma rápida, consistente e personalizada, minimizando o esforço manual.

**User Stories:**

*   **Story 2.1: Geração de Resposta Sugerida por IA**
    *   **Descrição:** Como gestor, para cada review, quero ter um botão "Gerar Resposta Sugerida" que utiliza IA para criar uma resposta contextualizada.
    *   **Critério de Aceitação:** A resposta sugerida considera o rating, a polaridade (elogio/reclamação) e o texto da review (problema/elogio específico).
    *   **Pesquisa Crítica (Input de `@analyst` Atlas):** O `@analyst` confirmará as plataformas que permitem **publicação direta** via API e as que exigem `copy-paste`. O MVP deve suportar ambas as modalidades, com feedback visual claro ao utilizador.
*   **Story 2.2: Configuração de "Voz" do Restaurante**
    *   **Descrição:** Como gestor, quero configurar a "voz" do meu restaurante (formal, informal, humor leve) a nível de conta, para que as respostas da IA reflitam a identidade da minha marca.
    *   **Critério de Aceitação:** As respostas sugeridas pela IA adaptam-se visivelmente ao tom configurado.
*   **Story 2.3: Edição e Publicação da Resposta**
    *   **Descrição:** Como gestor, quero aceitar a resposta sugerida tal como está, editá-la antes de enviar, ou pedir uma nova sugestão. Quero também que o estado da review mude para "Respondida" após a confirmação da publicação.
    *   **Critério de Aceitação:** A edição manual é fluida. O estado da review é atualizado em tempo real.

### **Épico 3: Módulo de Alertas e Notificações (Proactive Awareness)**

**Objetivo:** Alertar proativamente o gestor sobre novas reviews, especialmente as críticas, para permitir uma resposta atempada.

**User Stories:**

*   **Story 3.1: Alertas de Reviews Críticas**
    *   **Descrição:** Como gestor, quero receber alertas imediatos por email e/ou notificação push (pesquisa: `@analyst` Atlas determinará a preferência) sempre que uma review de 1-3 estrelas for importada.
    *   **Critério de Aceitação:** Um alerta para uma review 1-2 estrelas é recebido em [Y] minutos após a importação (pesquisa: `@analyst` Atlas definirá `Y` com base na urgência percebida e viabilidade técnica).
    *   **Pesquisa de UX (Input de `@analyst` Atlas):** Confirme a preferência dos donos de restaurantes entre WhatsApp, Notificação Push e Email para alertas críticos. O MVP deve priorizar a opção mais preferida.
*   **Story 3.2: Resumo Diário de Novas Reviews**
    *   **Descrição:** Como gestor, quero ter a opção de receber um resumo diário consolidado com todas as reviews novas do dia anterior.
    *   **Critério de Aceitação:** O resumo diário chega na caixa de entrada do email todas as manhãs às 8h (horário configurável).

### **Épico 4: Módulo de Insights e Análise de Reputação (Strategic Intelligence)**

**Objetivo:** Transformar o feedback bruto em inteligência acionável para decisões estratégicas que impactam o negócio.

**User Stories:**

*   **Story 4.1: Painel Básico de Métricas de Reputação**
    *   **Descrição:** Como gestor, quero um painel visualmente claro que me mostre a nota média por plataforma, o número de reviews por período (dia/semana/mês) e a percentagem de reviews respondidas.
    *   **Critério de Aceitação:** O painel apresenta um snapshot claro da reputação do restaurante, fácil de interpretar em 30 segundos.
*   **Story 4.2: Identificação de Temas e Tendências**
    *   **Descrição:** Como gestor, quero que o sistema identifique automaticamente palavras-chave ligadas a temas comuns (serviço, comida, preço, ambiente) e me mostre a contagem por tema e a sua tendência (a subir/estável/descida).
    *   **Critério de Aceitação:** Consigo ver os 3 temas mais mencionados na semana e se estão a melhorar ou piorar.
*   **Story 4.3: Conexão com Academia (Processo Mateus Marcondes)**
    *   **Descrição:** Como gestor, quero que o sistema, ao identificar a recorrência de um tema negativo (ex: "serviço rude"), sugira proactivamente módulos de formação relevantes da Academia iaMenu.
    *   **Critério de Aceitação:** Ao clicar no tema "serviço rude" no dashboard, o sistema apresenta um link direto para o módulo de formação "Atendimento ao Cliente de Excelência" na Academia.

### **Épico 5: Módulo de Feedback Privado (Optional - MVP)**

**Objetivo:** Capturar feedback direto e construtivo do cliente antes que se torne uma review pública negativa.

**User Stories:**

*   **Story 5.1: Geração de Link/QR Code para Feedback**
    *   **Descrição:** Como gestor, quero gerar um QR code ou link único para solicitar feedback privado dos meus clientes.
    *   **Critério de Aceitação:** O QR code gerado leva a um formulário NPS simples e personalizável.
*   **Story 5.2: Ingestão de Feedback Privado na Inbox**
    *   **Descrição:** Como gestor, quero que o feedback privado recolhido apareça na mesma inbox unificada, mas claramente marcado como "Privado".
    *   **Critério de Aceitação:** Consigo filtrar para ver apenas feedback privado ou reviews públicas separadamente.

---

## **5. Requisitos Não Funcionais - A Base Robusta da 'Mansão'**

**Performance:**

*   **Interface Responsiva:** Essencialmente otimizada para mobile, permitindo que o gestor a utilize fluidamente "entre tarefas" no seu smartphone.
*   **Meta de Tempo de Carregamento:** Tempo de carregamento da inbox < 2 segundos em redes 4G.

**Usabilidade:**

*   **Fluxos Curtos e Intuitivos:** Ações críticas (ver reviews sem resposta, gerar e aprovar resposta) devem ser concluídas em **menos de 30 segundos** após a leitura da review.
*   **Design Minimalista e Focado:** UX/UI deve ser ultra-focado nas tarefas essenciais do dono de restaurante, evitando "ruído" de marketing.

**Segurança/Privacidade:**

*   **Proteção de Dados:** Armazenar apenas os dados mínimos e necessários das reviews.
*   **Conformidade:** Rigoroso cumprimento dos termos de serviço das APIs das plataformas (Google, TripAdvisor, etc.) e do RGPD para dados pessoais.
*   **Controlo de Acesso:** Implementar RLS (Row-Level Security) se aplicável ao modelo de dados, garantindo que os dados de um restaurante não sejam visíveis para outros.

**Disponibilidade:**

*   **Meta Inicial:** 99% uptime mensal.
*   **Monitorização:** Implementar monitorização proativa com alertas para a equipa de engenharia em caso de indisponibilidade ou degradação de serviço.

---

## **6. Arquitetura e Integrações (Roadmap Técnico) - A Planta da 'Mansão'**

Este é um pilar crítico para evitar um "código frankenstein".

**Stack de Tecnologia (Sugestão de `@architect` Aria):**

*   **Backend:** Node.js (ou Java para Core API, conforme o ecossistema iaMenu).
*   **Frontend:** React (para protótipo visual, considerando o ecossistema iaMenu).
*   **Base de Dados (Input de `@architect` Aria e `@data-engineer` Dara):**
    *   PostgreSQL como base de dados primária, devido à sua robustez, capacidade de lidar com dados textuais (JSONB para reviews), e RLS (Row-Level Security) para privacidade de dados multitenant.
    *   **Esquema de Banco de Dados:** Será criado em inglês. Exemplo de tabela `reviews`:
        ```sql
        CREATE TABLE reviews (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL, -- Para multitenancy iaMenu
            platform_id TEXT NOT NULL,                           -- ID da review na plataforma
            source_platform TEXT NOT NULL,                       -- Ex: 'Google Business', 'TripAdvisor'
            rating INTEGER NOT NULL,                             -- 1-5 estrelas
            review_text TEXT NOT NULL,                           -- Texto original da review
            review_text_translated TEXT,                         -- Tradução opcional
            review_date TIMESTAMP WITH TIME ZONE NOT NULL,       -- DATA CRÍTICA (Input de utilizador)
            response_status TEXT DEFAULT 'pending' NOT NULL,     -- 'pending', 'responded', 'draft'
            response_text TEXT,                                  -- Resposta final do gestor
            ai_suggested_response TEXT,                          -- Última sugestão da IA
            voice_config JSONB,                                  -- Configuração de voz da IA
            sentiment_score FLOAT,                               -- Análise de sentimento (Fase 2)
            themes TEXT[],                                       -- Tags/temas identificados (serviço, comida)
            is_private BOOLEAN DEFAULT FALSE NOT NULL,           -- Para feedback privado
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        -- Implementar RLS para reviews baseadas em restaurant_id
        -- Criar indexes para source_platform, rating, review_date, response_status
        ```
    *   **Modularidade para iaMenu:** A arquitetura do banco de dados deve prever que `restaurant_id` seja um FK (Foreign Key) para uma tabela `restaurants` centralizada no ecossistema `iaMenu`, permitindo correlação futura com vendas/faturação.

**Integrações MVP:**

*   **Conectores API:** Google Business Profile, TripAdvisor.
    *   **Pesquisa Crítica (Input de `@analyst` Atlas):** Será necessário um conector específico para cada API, avaliando as suas nuances e restrições de escrita (publicação de respostas).
*   **Alertas:** Via Email (MVP). Integração futura com serviços de SMS/WhatsApp.
*   **IA de Resposta:** Chamada a modelo externo (ex: OpenAI, Gemini) com uma camada de prompt específica para o contexto da restauração e configurada para a "voz" do restaurante.

**Fase 2 (Pós-MVP) e Visão do Ecossistema iaMenu:**

*   **Expansão de Plataformas:** Mais plataformas de reviews (Facebook, Uber/Glovo, TheFork).
*   **Publicação Automática:** Implementação de publicação direta de respostas nas plataformas (se as APIs permitirem).
*   **Integração Profunda com iaMenu:**
    *   **iaMenu Academia (Input de "Processo Mateus Marcondes"):** Sugestão automatizada de cursos de formação (`Academia`) quando temas negativos recorrentes são detetados nas reviews (ex: "serviço" → módulo de atendimento).
    *   **iaMenu BI:** Correlação avançada entre reviews, vendas, faturação e outros KPIs de negócio para insights estratégicos.
    *   **iaMenu Menu:** Sugestões de alterações no menu baseadas em feedback de comida recorrente.

---

## **7. Fluxos de Utilizador (Alto Nível) - O Caminho na 'Mansão'**

**Fluxo 1 – Dono responde a uma review negativa (com Assistência Inteligente)**

1.  Entra review 1 estrela no Google.
2.  Sistema importa review, marca visualmente como "CRÍTICA" (vermelho) e dispara alerta (`@analyst` Atlas determinou a preferência por email/notificação push).
3.  Dono abre a review na inbox unificada. Vê o cronómetro de 24h a contar.
4.  Clica em "Gerar Resposta Sugerida"; a IA (com a "voz" do restaurante) cria uma resposta contextualizada.
5.  Dono lê, ajusta (se necessário) e aprova.
6.  Resposta é copiada/enviada diretamente via API (ou via `copy-paste` com instrução clara se a API não permitir publicação direta).
7.  Estado da review muda para "Respondida".

**Fluxo 2 – Dono revê reputação estratégica da semana (com Insights Acionáveis)**

1.  Dono abre o dashboard, otimizado para mobile.
2.  Vê nota média da semana, quantidade de reviews e % respondidas.
3.  Vê os 2-3 temas mais mencionados (ex.: "demora", "simpatia", "limpeza") e a sua tendência.
4.  Ao clicar em "simpatia", o sistema sugere um módulo da iaMenu Academia: "Curso de Atendimento ao Cliente de Excelência" (Processo Mateus Marcondes).
5.  Usa essa informação e as sugestões para ajustar equipa/processos e planeamento de formação.

---

## **8. Restrições e Riscos - Muros de Suporte da 'Mansão'**

*   **Dependência de APIs:** A funcionalidade de publicação direta de respostas e a abrangência dos dados de reviews dependem criticamente das políticas e limitações das APIs de Google Business, TripAdvisor, etc.
*   **Risco de Over-Automação:** A IA não pode gerar respostas agressivas, irrelevantes ou falsas. A edição humana fácil e uma camada de segurança (filtros de conteúdo, `guardrails`) são cruciais.
*   **UX/UI "Ultra-Concreta":** O produto não deve parecer "mais um dashboard de marketing". A mensagem e a experiência do utilizador devem ser focadas em ações e inteligência operacional para o dono do restaurante "mão na massa".
*   **Concorrência:** Mercado saturado de "dashboards", mas poucos com IA contextualizada para restauração e integração com um ecossistema como o iaMenu. O nosso diferencial é a inteligência acionável e a integração vertical.

---
