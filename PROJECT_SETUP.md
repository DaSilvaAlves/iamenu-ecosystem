# iaMenu Ecosystem - Guia de Configuração e Arranque

Este documento descreve a arquitetura dos serviços do projeto iaMenu Ecosystem e fornece instruções passo a passo para configurar e executar o ambiente de desenvolvimento local.

## 1. Visão Geral da Arquitetura

O ecossistema é composto por um frontend (React/Vite) e múltiplos microserviços de backend (Node.js/Express e Java/Spring Boot). É crucial que cada serviço corra na sua porta designada para que a comunicação entre eles funcione corretamente.

## 2. Estrutura de Diretórios

- **Raiz do Projeto:** `C:\Users\XPS\Documents\iamenu-ecosystem`
- **Frontend:** `frontend/apps/prototype-vision`
- **Serviços Node.js:** `services/`
- **API Core (Java):** `core/`

## 3. Serviços e Portas

| Serviço | Diretório | Porta | Comando de Arranque |
| :--- | :--- | :--- | :--- |
| Frontend (Vite) | `frontend/apps/prototype-vision`| `5173` | `npm run dev` |
| Business Service (Node.js) | `services/business` | `3002` | `npm run dev` |
| Academy Service (Node.js) | `services/academy` | `3003` | `npm run dev` |
| Community Service (Node.js) | `services/community`| `3004` | `npm run dev` |
| Marketplace Service (Node.js) | `services/marketplace`| `3005` | `npm run dev` |
| Core API (Java) | `core` | `8080` | `mvn spring-boot:run` |

---

## 4. Configuração do Frontend

O ficheiro `.env` do frontend é crítico para a comunicação com os backends. Ele deve estar configurado da seguinte forma:

**Ficheiro:** `frontend/apps/prototype-vision/.env`

```
# API Base URLs - Backend Services
VITE_COMMUNITY_API_URL=http://localhost:3004/api/v1/community
VITE_MARKETPLACE_API_URL=http://localhost:3005/api/v1/marketplace
VITE_BUSINESS_API_URL=http://localhost:3002/api/v1/business
VITE_ACADEMY_API_URL=http://localhost:3003/api/v1/academy
```

---

## 5. Procedimento de Arranque (Ambiente Completo)

Para iniciar todo o ambiente de desenvolvimento, siga estes passos, abrindo um terminal para cada serviço.

**IMPORTANTE:** Inicie os serviços de backend primeiro, e só depois o frontend.

1.  **Iniciar Business Service:**
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\services\business
    npm run dev
    ```

2.  **Iniciar Academy Service:**
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\services\academy
    npm run dev
    ```

3.  **Iniciar Community Service:**
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\services\community
    npm run dev
    ```

4.  **Iniciar Marketplace Service:**
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\services\marketplace
    npm run dev
    ```

5.  **Iniciar Core API (Java):** (Se necessário)
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\core
    mvn spring-boot:run
    ```

6.  **Iniciar Frontend:**
    ```bash
    cd C:\Users\XPS\Documents\iamenu-ecosystem\frontend\apps\prototype-vision
    npm run dev
    ```

Após estes passos, a aplicação deverá estar acessível em `http://localhost:5173/`.

---
**Nota sobre Processos em Segundo Plano (Windows PowerShell):**
Para evitar que os processos terminem, pode iniciá-los em segundo plano. Por exemplo, para o frontend:
`Start-Process -NoNewWindow powershell -ArgumentList "-Command", "npm run dev"`
