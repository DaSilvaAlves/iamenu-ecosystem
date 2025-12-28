# 📊 iaMenu Business Intelligence API

Backend API para Onboarding e Dashboard Business Intelligence do iaMenu Ecosystem.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar database
npx prisma db push

# Popular com dados de teste
npx tsx prisma/seed.ts

# Iniciar servidor dev
npm run dev
```

Servidor roda em: `http://localhost:3003`

---

## 🔑 Autenticação

Todos os endpoints (exceto `/onboarding/template`) requerem JWT token no header:

```bash
Authorization: Bearer <token>
```

**Token de teste:**
```bash
node generate-test-token.js
```

---

## 📋 Endpoints

### Base URL: `/api/v1/business`

### 1. Onboarding

#### POST `/onboarding/setup`
Setup inicial do restaurante com upload de Excel opcional.

**Auth:** ✅ Required

**Body (multipart/form-data):**
```json
{
  "restaurantName": "Restaurante O Pátio",
  "address": "Rua das Flores, 123, Lisboa",
  "cuisine": "portuguesa",
  "tables": 20,
  "openHour": "12:00",
  "closeHour": "23:00",
  "menuUploadType": "excel",
  "menuFile": "<file.xlsx>",
  "monthlyCosts": 5000,
  "staffCount": 8,
  "averageTicket": 25.50,
  "suppliers": "Fornecedor A, Fornecedor B",
  "revenueGoal": 50000,
  "foodCostTarget": 30,
  "tableRotation": 3,
  "segment": "casual"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurantId": "uuid",
    "productsCount": 12,
    "insights": {
      "totalProducts": 12,
      "avgFoodCost": 28.5,
      "avgMargin": 65.2,
      "potentialRevenue": 45600,
      "criticalAlerts": 2,
      "opportunities": 3,
      "recommendations": [...]
    }
  }
}
```

---

#### GET `/onboarding/template`
Download template Excel para upload de menu.

**Auth:** ❌ Public

**Response:** Ficheiro Excel (.xlsx)

---

#### GET `/onboarding/status`
Verificar status do onboarding.

**Auth:** ✅ Required

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": true,
    "hasRestaurant": true,
    "restaurantName": "Restaurante O Pátio",
    "productsCount": 12,
    "ordersCount": 50
  }
}
```

---

### 2. Dashboard

#### GET `/dashboard/stats`
Estatísticas gerais (receita, clientes, ticket médio, food cost).

**Auth:** ✅ Required

**Query Params:**
- `period` - `hoje`, `semana`, `mes`, `ano` (default: `semana`)

**Response:**
```json
{
  "success": true,
  "data": {
    "receita": {
      "value": 616.43,
      "formatted": "€616.43",
      "trend": "+43.2%",
      "isUp": true,
      "vs": "vs. semana anterior"
    },
    "clientes": {
      "value": 13,
      "trend": "-7.1%",
      "isUp": false
    },
    "ticketMedio": {
      "value": 47.42,
      "formatted": "€47.42",
      "trend": "+54.2%",
      "isUp": true,
      "vs": "Meta: €25.5"
    },
    "foodCost": {
      "value": 33.0,
      "formatted": "33.0%",
      "trend": "Atenção",
      "isUp": false,
      "vs": "Meta: 30%"
    }
  }
}
```

---

#### GET `/dashboard/top-products`
Top produtos mais vendidos.

**Auth:** ✅ Required

**Query Params:**
- `limit` - número de produtos (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Bacalhau à Brás",
      "category": "Main Course",
      "sales": 156,
      "revenue": 2886,
      "margin": "66.5%",
      "classification": "star",
      "trend": "up"
    }
  ]
}
```

**Classifications:**
- `star` - Alta margem + Altas vendas
- `gem` - Alta margem + Baixas vendas
- `popular` - Baixa margem + Altas vendas
- `dog` - Baixa margem + Baixas vendas

---

#### GET `/dashboard/alerts`
Alertas críticos e warnings.

**Auth:** ✅ Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "critical",
      "title": "Food Cost Elevado",
      "subtitle": "Critical Impact • Polvo à Lagareiro",
      "description": "O produto ... tem food cost de 43.2%...",
      "time": "2h ago",
      "action": "Rever Produto",
      "actionUrl": "/products/uuid"
    }
  ]
}
```

---

#### GET `/dashboard/opportunities`
Oportunidades de melhoria.

**Auth:** ✅ Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "revenue",
      "title": "Produtos 'Gemas' Não Promovidos",
      "subtitle": "Opportunity • 3 produtos",
      "description": "3 produtos têm margem alta mas vendas baixas...",
      "potentialRevenue": 1200,
      "action": "Ver Produtos",
      "actionUrl": "/products?filter=gems"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Restaurant
- Dados básicos (nome, morada, cozinha, mesas)
- Dados financeiros (custos, staff, ticket médio)

### Product
- Menu (nome, categoria, preço, custo)
- Métricas (vendas, receita, popularidade)

### Order
- Vendas (total, status, data)

### RestaurantSettings
- Metas (receita goal, food cost target, rotação)

---

## 🧪 Testing

```bash
# Gerar token de teste
node generate-test-token.js

# Testar health check
curl http://localhost:3003/health

# Testar stats
curl -H "Authorization: Bearer <token>" \
  http://localhost:3003/api/v1/business/dashboard/stats

# Download template
curl -O http://localhost:3003/api/v1/business/onboarding/template
```

---

## 📦 Dependencies

- **Express** - Web framework
- **Prisma** - ORM (SQLite)
- **xlsx** - Excel parsing
- **exceljs** - Excel generation
- **jsonwebtoken** - JWT auth
- **multer** - File uploads

---

## 🔗 Integration

Este service integra-se com:
- **Community API** (porta 3001) - Autenticação JWT partilhada
- **iaMenu PRO** (futuro) - Sincronização de dados

---

## 📝 Notes

- Port: `3003`
- Database: SQLite (`prisma/dev.db`)
- JWT Secret: Partilhado com Community API
- Uploads: Pasta `uploads/` (temporário)
