# Setup e Testes - Pratos do Dia

## 1. Executar a Migration no Supabase

### Passos:
1. Aceda ao painel do Supabase: https://supabase.com
2. Selecione o seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Cole o seguinte SQL e execute:

```sql
-- Add is_daily_special column (boolean to mark if item is a daily special)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS is_daily_special BOOLEAN DEFAULT false;

-- Add special_date column (date when this item is featured as daily special)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS special_date DATE;

-- Add special_price column (optional discounted price for daily specials)
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS special_price DECIMAL(10,2);

-- Create index for faster queries on daily specials
CREATE INDEX IF NOT EXISTS idx_menu_items_daily_special
ON menu_items(is_daily_special, special_date)
WHERE is_daily_special = true;
```

5. Clique em **Run** para executar o SQL

## 2. Reiniciar o Servidor

Depois de executar a migration, reinicie o servidor takeway-proxy:

```bash
cd C:\Users\XPS\Documents\iamenu-ecosystem\services\takeway-proxy
npm run dev
```

## 3. Como Testar

### 3.1 Listar todos os menu items (para obter um ID)

```bash
curl http://localhost:3006/api/supabase/menu-items
```

Copie o `id` de um dos pratos que quer marcar como prato do dia.

### 3.2 Marcar um prato como "Prato do Dia"

Substitua `<MENU_ITEM_ID>` pelo ID copiado acima:

```bash
curl -X POST http://localhost:3006/api/supabase/menu-items/<MENU_ITEM_ID>/set-daily-special -H "Content-Type: application/json" -d "{\"special_date\":\"2026-01-11\"}"
```

**Com preço especial:**
```bash
curl -X POST http://localhost:3006/api/supabase/menu-items/<MENU_ITEM_ID>/set-daily-special -H "Content-Type: application/json" -d "{\"special_date\":\"2026-01-11\",\"special_price\":9.99}"
```

**Resposta esperada:**
```json
{
  "message": "Prato marcado como prato do dia com sucesso.",
  "data": {
    "id": "...",
    "name": "...",
    "is_daily_special": true,
    "special_date": "2026-01-11",
    "special_price": 9.99,
    ...
  }
}
```

### 3.3 Listar os pratos do dia de hoje

```bash
curl http://localhost:3006/api/supabase/daily-specials
```

### 3.4 Listar pratos do dia de uma data específica

```bash
curl "http://localhost:3006/api/supabase/daily-specials?date=2026-01-11"
```

### 3.5 Remover um prato dos "Pratos do Dia"

Substitua `<MENU_ITEM_ID>` pelo ID do prato:

```bash
curl -X DELETE http://localhost:3006/api/supabase/menu-items/<MENU_ITEM_ID>/remove-daily-special
```

**Resposta esperada:**
```json
{
  "message": "Prato removido dos pratos do dia com sucesso.",
  "data": {
    "id": "...",
    "name": "...",
    "is_daily_special": false,
    "special_date": null,
    "special_price": null,
    ...
  }
}
```

## 4. Resumo das Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/supabase/daily-specials` | Lista pratos do dia (hoje por padrão) |
| GET | `/api/supabase/daily-specials?date=YYYY-MM-DD` | Lista pratos do dia de uma data específica |
| POST | `/api/supabase/menu-items/:id/set-daily-special` | Marca prato como prato do dia |
| DELETE | `/api/supabase/menu-items/:id/remove-daily-special` | Remove prato dos pratos do dia |

## 5. Campos Adicionados à Tabela menu_items

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `is_daily_special` | BOOLEAN | Indica se o item é um prato do dia |
| `special_date` | DATE | Data em que o prato é destaque |
| `special_price` | DECIMAL(10,2) | Preço especial (opcional, diferente do preço regular) |

## 6. Exemplo Completo de Teste

```bash
# 1. Listar menu items
curl http://localhost:3006/api/supabase/menu-items

# 2. Marcar "Feijoada" como prato do dia de hoje com preço especial
curl -X POST http://localhost:3006/api/supabase/menu-items/3f6b2b18-966c-4301-866e-0162e3f167f2/set-daily-special -H "Content-Type: application/json" -d "{\"special_date\":\"2026-01-11\",\"special_price\":10.50}"

# 3. Ver pratos do dia
curl http://localhost:3006/api/supabase/daily-specials

# 4. Remover prato do dia
curl -X DELETE http://localhost:3006/api/supabase/menu-items/3f6b2b18-966c-4301-866e-0162e3f167f2/remove-daily-special
```

## 7. Integração com Frontend

No seu frontend, pode usar estas rotas para:

- Mostrar os "Pratos do Dia" na página principal do restaurante
- Permitir ao administrador marcar/desmarcar pratos como pratos do dia
- Definir preços especiais para pratos do dia
- Programar pratos do dia para datas futuras
