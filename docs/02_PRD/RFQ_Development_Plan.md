# Plano de Desenvolvimento - Funcionalidade de Pedidos de Orçamento (RFQ)

## Contexto

Este documento detalha as próximas etapas para a conclusão da funcionalidade de Pedidos de Orçamento (Request for Quote - RFQ) no Marketplace de Fornecedores do iaMenu. A fase de backend está concluída e testada, e agora o foco é na implementação da interface de utilizador (UI) no frontend.

## Funcionalidade RFQ (Secção 5.4 do PRD)

**Descrição:** Restaurador pede orçamento a 1 ou múltiplos fornecedores via plataforma.

## Tarefas Pendentes - Frontend UI

### 1. Criar Interface para Pedido de Orçamento (Formulário)

**Objetivo:** Permitir que o restaurador selecione produtos, especifique quantidades, frequência de entrega, morada e selecione fornecedores para os quais enviar o pedido.

**Componente:** `RfqTab.jsx` (já existe um esqueleto, precisa de ser aprimorado)

**Sub-tarefas:**
-   [ ] **Seleção de Produtos:**
    -   [ ] Desenvolver um mecanismo para o restaurador adicionar múltiplos itens ao pedido (ex: lista de produtos com campos de quantidade e unidade).
    -   [ ] Possibilidade de pesquisar produtos existentes (integrar com o backend se houver um endpoint `GET /products`).
    -   [ ] Entrada manual de produtos caso não estejam listados.
-   [ ] **Seleção de Fornecedores:**
    -   [ ] Desenvolver um seletor de fornecedores que permita escolher um ou vários fornecedores (integrar com `GET /suppliers`).
    -   [ ] Validação para garantir que um fornecedor válido é selecionado.
-   [ ] **Detalhes do Pedido:**
    -   [ ] Campos para Frequência de Entrega (dropdown: semanal/quinzenal/mensal/pontual).
    -   [ ] Campo para Morada de Entrega (pode ser pré-preenchido com a morada do restaurante).
    -   [ ] Campo para Data de Início Preferida.
    -   [ ] Campo de observações adicionais.
-   [ ] **Submissão do Pedido:**
    -   [ ] Integrar o formulário com o endpoint `POST /api/v1/marketplace/quotes/request`.
    -   [ ] Apresentar feedback ao utilizador (sucesso/erro).

### 2. Criar Interface para Visualizar Pedidos de Orçamento Enviados (Restaurador)

**Objetivo:** Permitir que o restaurador veja o histórico dos pedidos de orçamento que enviou, juntamente com as respostas dos fornecedores.

**Componente:** `RfqRequestsTab.jsx` (novo componente, a ser integrado no `Marketplace.jsx` ou `ResponsesTab.jsx`)

**Sub-tarefas:**
-   [ ] **Listagem de Pedidos:**
    -   [ ] Chamar o endpoint `GET /api/v1/marketplace/quotes/requests` (com `restaurantId` do utilizador autenticado).
    -   [ ] Apresentar uma lista paginada dos pedidos enviados.
-   [ ] **Detalhes do Pedido:**
    -   [ ] Para cada pedido, exibir:
        -   Fornecedores contactados.
        -   Itens solicitados.
        -   Estado do pedido (pendente, respondido, aceite, cancelado).
        -   Data de criação.
-   [ ] **Visualização de Respostas (Cotações):**
    -   [ ] Para cada pedido com status 'quoted', exibir as cotações recebidas dos fornecedores.
    -   [ ] Detalhes da cotação: preços por item, termos de entrega/pagamento, validade.
    -   [ ] Opção para "Aceitar Cotação" (funcionalidade futura, por agora apenas UI).

### 3. Criar Interface para Visualizar Pedidos de Orçamento Recebidos (Fornecedor)

**Objetivo:** Permitir que o fornecedor veja os pedidos de orçamento que lhe foram dirigidos e tenha a opção de responder.

**Componente:** `IncomingRfqTab.jsx` (novo componente, a ser integrado no `Marketplace.jsx` ou `ResponsesTab.jsx`)

**Sub-tarefas:**
-   [ ] **Listagem de Pedidos:**
    -   [ ] Chamar o endpoint `GET /api/v1/marketplace/quotes/incoming` (com `supplierId` do utilizador autenticado).
    -   [ ] Apresentar uma lista paginada dos pedidos recebidos.
-   [ ] **Detalhes do Pedido:**
    -   [ ] Para cada pedido, exibir:
        -   Restaurador que solicitou.
        -   Itens solicitados.
        -   Notas, frequência e morada de entrega.
        -   Estado do pedido.
-   [ ] **Formulário de Resposta (Cotação):**
    -   [ ] Para cada pedido, um botão "Responder" que abre um formulário.
    -   [ ] Formulário para inserir:
        -   Preços por item.
        -   Termos de entrega/pagamento.
        -   Validade da oferta.
        -   Observações.
    -   [ ] Integrar o formulário com o endpoint `POST /api/v1/marketplace/quotes/:id/respond`.
    -   [ ] Apresentar feedback ao utilizador (sucesso/erro).

## Integração no `Marketplace.jsx`

-   [ ] Atualizar a lista de `tabs` para incluir os novos separadores (ex: "Meus Pedidos", "Pedidos Recebidos").
-   [ ] Atualizar a função `ActiveComponent` para renderizar os novos componentes de interface.

## Próximos Passos (Workflow)

1.  **Commit:** Fazer commit deste plano de desenvolvimento.
2.  **Começar Implementação:** Iniciar o desenvolvimento dos componentes de UI para o frontend, começando pela "Seleção de Produtos" no `RfqTab.jsx`.
3.  **Testar:** Testar cada sub-tarefa à medida que é implementada.
