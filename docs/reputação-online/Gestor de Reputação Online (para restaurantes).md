## **1\. Visão e enquadramento**

Produto: Gestor de Reputação Online (para restaurantes)  
Tipo: Módulo SaaS focado em reviews e feedback de clientes

Problema a resolver

* Reviews negativas ficam sem resposta ou são respondidas tarde e mal.  
* Dono/gestor não tem tempo nem disciplina para abrir várias plataformas todos os dias.  
* Ninguém transforma feedback em decisões concretas (formação, processos, menu, serviço).

Visão  
Ser a “central de reputação” do restaurante: uma caixa única onde entram reviews públicas e feedback privado, com respostas sugeridas por IA e insights claros para melhorar experiência e faturação.

---

## **2\. Objetivos e métricas de sucesso**

Objetivos de negócio (12 meses)

1. Aumentar para \>90% a percentagem de reviews respondidas dos restaurantes que usam o produto.  
2. Reduzir o tempo médio de resposta a reviews para \<24h.  
3. Atingir uma melhoria média de \+0,3 pontos na nota das plataformas em 6–12 meses (quando aplicado de forma consistente).

KPIs principais

* % de reviews respondidas (por período e por plataforma).  
* Tempo médio de resposta.  
* Nota média por plataforma antes/depois de X meses.  
* Nº de problemas recorrentes identificados e resolvidos (tagados no sistema).

---

## **3\. Público‑alvo e persona**

Restaurantes alvo

* Restaurantes independentes, pequenos grupos, dark kitchens.  
* Já têm presença em pelo menos 1–2 plataformas de reviews (Google Business, TripAdvisor, Facebook).

Persona principal: Dono/gestor “afogado”

* 30–55 anos, gere operação no dia a dia.  
* Sabe que reviews importam, mas não tem tempo nem método.  
* Quer evitar “vergonhas” públicas e usar o feedback para melhorar equipa e operação.

---

## **4\. Escopo funcional (MVP)**

## **4.1. Inbox unificada de reviews**

Requisitos

* Conectar a pelo menos 1–2 fontes no MVP (por exemplo:  
  * Google Business Profile  
  * TripAdvisor  
  * (Facebook pode ficar como Fase 2, se complicar autenticação no MVP.)  
* Importar automaticamente:  
  * rating (1–5 estrelas)  
  * texto da review  
  * data/hora  
  * plataforma de origem  
* Exibir numa lista única com filtros:  
  * Por plataforma  
  * Por rating (negativas 1–3 / positivas 4–5)  
  * Por estado: “sem resposta”, “respondida”

Critérios de aceitação (exemplos)

* Uma review publicada no Google aparece no sistema em até X minutos (a definir conforme limitações técnicas).  
* O utilizador consegue listar apenas reviews sem resposta em 2 cliques.

---

## **4.2. Resposta assistida por IA**

Requisitos

* Para cada review, mostrar:  
  * Campo para escrever resposta manualmente.  
  * Botão “Gerar resposta sugerida”.  
* A resposta sugerida deve ter em conta:  
  * Rating  
  * Polaridade (elogio vs reclamação)  
  * Texto da review (problema citado, elogio, etc.)  
* Permitir configurar “voz” do restaurante a nível de conta (ex.: mais formal / mais informal / com humor leve).  
* Utilizador pode:  
  * Aceitar resposta sugerida tal como está  
  * Editar antes de enviar  
  * Pedir outra sugestão

Estados

* “Sem resposta” → “Resposta pendente de publicação” → “Respondida” (quando for confirmada e enviada na plataforma).

*(Implementação de publicação direta ou não depende das APIs; MVP pode ser copy‑paste simples com resposta guardada para métricas, se não der publicar diretamente.)*

---

## **4.3. Alertas de novas reviews**

Requisitos

* Possibilidade de configurar alertas por email e/ou mobile (ex.: push/notificação ou pelo menos email no MVP).  
* Regras simples no MVP:  
  * Alertar sempre que entrar review de 1–3 estrelas.  
  * Opcional: resumo diário com todas as reviews novas.

Critérios de aceitação

* Quando uma review 1–2 estrelas entra, o dono recebe alerta em poucos minutos.

---

## **4.4. Insights e análise de reputação**

Requisitos (MVP básico)

* Painel com:  
  * Nota média por plataforma.  
  * Nº de reviews por período (dia/semana/mês).  
  * % de reviews respondidas.  
  * Tempo médio de resposta.  
* Tags/temas:  
  * Sistema deve identificar palavras ligadas a temas comuns (serviço, comida, preço, tempo, ambiente, entrega).  
  * Mostrar contagem por tema e tendência (a subir/estável/descida).

*(Análise de sentimento avançada e gráficos mais sofisticados podem ir para Fase 2; MVP deve ser simples e útil.)*

---

## **4.5. Feedback privado (opcional em MVP)**

Se entrar no MVP

* Gerar QR code ou link para feedback interno (NPS simples):  
  * “De 0 a 10, recomendarias este restaurante?”  
  * 1–2 perguntas abertas opcionais.  
* Este feedback entra na mesma inbox, mas marcado como “privado” (não público).  
* Objetivo: captar reclamações antes de o cliente ir para Google.

---

## **5\. Requisitos não funcionais**

Performance

* Interface responsiva, especialmente em mobile (dono usa no telemóvel entre tarefas).

Usabilidade

* Fluxos curtos:  
  * Ver reviews sem resposta em poucos cliques.  
  * Gerar e aprovar resposta em menos de 30 segundos após leitura da review (meta qualitativa).

Segurança/Privacidade

* Guardar apenas os dados mínimos necessários das reviews.  
* Cumprir termos das plataformas (uso de APIs) e RGPD para dados pessoais.

Disponibilidade

* Meta inicial: 99% uptime mensal.

---

## **6\. Integrações e roadmap técnico**

MVP

* Conectores para:  
  * Google Business Profile  
  * TripAdvisor  
* Alertas via email.  
* IA de resposta integrada (chamada a modelo externo, com camada de prompt específica para restauração).

Fase 2 (pós‑MVP)

* Mais plataformas (Facebook, Uber/Glovo reviews quando viável).  
* Publicação automática de respostas diretamente nas plataformas.  
* Integração com outros produtos teus (iaMenu / BI / Academia) para:  
  * Sugestão de cursos quando um tema aparece muito (ex.: “serviço” → módulo de atendimento).  
  * Ver correlação entre reviews e vendas/faturação.

---

## **7\. Fluxos de utilizador (alto nível)**

Fluxo 1 – Dono responde a uma review negativa

1. Entra review 1 estrela no Google.  
2. Sistema importa review e dispara alerta.  
3. Dono abre a review na inbox.  
4. Clica em “Gerar resposta”; lê, ajusta e aprova.  
5. Resposta é copiada/enviada; estado muda para “Respondida”.

Fluxo 2 – Dono revê reputação da semana

1. Abre dashboard.  
2. Vê nota média da semana, quantidade de reviews e % respondidas.  
3. Vê os 2–3 temas mais mencionados (ex.: “demora”, “simpatia”).  
4. Usa essa info para ajustar equipa/processos (ou conectar com formação).

---

## **8\. Restrições e riscos**

* Dependência de APIs e políticas de Google/TripAdvisor/Facebook (limites, tipo de dados, possibilidade de responder direto).  
* Risco de over‑automação: IA não pode gerar respostas agressivas ou irrelevantes; deve ter camada de segurança e edição humana fácil.  
* Evitar que produto pareça “mais um dashboard de marketing”: mensagens e UX devem ser ultra concretas e operacionais para dono de restaurante.

