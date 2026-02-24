# HANDOFF - Migração TypeScript Frontend (Sessão 2026-02-23 continuação)

## INSTRUÇÃO PARA NOVA SESSÃO

```
Lê o handoff em docs/handoffs/HANDOFF-2026-02-23-TS-MIGRATION.md
Activa /AIOS:agents:dev e continua a migração TS do frontend.
Faltam 12 ficheiros view sem tipos + ~10 ficheiros com 1-4 erros residuais.
O Vite build PASSA. Falta fazer tsc --noEmit passar.
NÃO commits ainda - working tree tem alterações pendentes.
```

---

## 1. ESTADO ACTUAL DA MIGRAÇÃO

**Tarefa:** Migrar TODOS os .jsx/.js do frontend para .tsx/.ts com strict TypeScript
**Story:** TECH-DEBT-002.1 (Fase 1 do Cenário C)

### Métricas
- **Erros tsc iniciais:** 1688
- **Erros tsc actuais:** ~740 (excluindo test/stories pré-existentes)
- **Vite build:** ✅ PASSA (esbuild é permissivo)
- **tsc --noEmit:** ❌ Ainda tem erros
- **Ficheiros renomeados:** 76 (61 .jsx→.tsx + 15 .js→.ts)
- **Ficheiros com tipos adicionados:** 65 de 76
- **Working tree:** DIRTY (nada commitado ainda!)
- **Branch:** main

### O que também foi feito
- `index.html`: actualizado `main.jsx` → `main.tsx`
- `config/createConfig.ts` movido para `scripts/createConfig.js` (era script Node.js no src/)

---

## 2. FICHEIROS COMPLETOS (tipos adicionados, 0-1 erros residuais)

### Root
- `main.tsx` ✅ (0 erros)
- `App.tsx` ✅ (9 erros - cascading de views que ainda não têm props tipadas)

### Infrastructure
- `stores/uiStore.ts` ✅
- `lib/stores/authStore.ts` ✅
- `lib/stores/uiStore.ts` ✅
- `lib/stores/notificationStore.ts` ✅
- `lib/api/client.ts` ✅
- `lib/api/hooks.ts` ✅
- `services/api.ts` ✅
- `services/businessAPI.ts` ✅
- `services/geminiService.ts` ✅

### Components (todos ✅, 0-4 erros residuais)
- `ErrorBoundary.tsx` ✅ (0 erros)
- `TextRenderer.tsx` ✅ (0 erros)
- `NotificationBadge.tsx` ✅ (1 erro)
- `TopBar.tsx` ✅ (2 erros)
- `Sidebar.tsx` ✅ (1 erro)
- `BenchmarkChart.tsx` ✅ (4 erros - chart.js types)
- `DemandForecastChart.tsx` ✅ (1 erro)
- `SalesTrendChart.tsx` ✅ (1 erro)
- `PeakHoursHeatmap.tsx` ✅ (0 erros)
- `MenuEngineeringMatrix.tsx` ✅ (0 erros)
- `MentionInput.tsx` ✅ (1 erro)
- `NotificationsPanel.tsx` ✅ (0 erros)

### Views completas (0 erros)
- `TokenLogin.tsx` ✅
- `TourRapidoView.tsx` ✅
- `VisaoEcossistemaView.tsx` ✅
- `HubsRegionaisView.tsx` ✅
- `PaymentsAutomationView.tsx` ✅
- `StaffAIView.tsx` ✅
- `UpgradePROView.tsx` ✅
- `TakewayLandingView.tsx` ✅
- `Academy.tsx` ✅

### Views com poucos erros residuais (1-3)
- `AlertsView.tsx` (1 erro - jsPDF getNumberOfPages)
- `ChatView.tsx` (1 erro - type mismatch)
- `CommunityView.tsx` (1 erro - PostFormData vs PostData)
- `CopyStudioView.tsx` ✅ (0 erros)
- `Marketplace.tsx` ✅ (0 erros)
- `ReputacaoOnlineView.tsx` (1 erro)
- `MarketingPlanner.tsx` (1 erro)
- `IncomingRfqTab.tsx` (1 erro)
- `ComparisonTab.tsx` ✅ (0 erros)
- `OrdersView.tsx` ✅ (0 erros)
- `ProductsView.tsx` ✅ (0 erros)
- `ResponsesTab.tsx` ✅ (0 erros)

### Subfolders parcialmente feitos
- `hubs-regionais/CreatePostModal.tsx` ✅
- `hubs-regionais/HubFeed.tsx` ✅
- `hubs-regionais/HubFeedback.tsx` ✅ (0 erros após fix hub → _hub)
- `hubs-regionais/HubResources.tsx` ✅
- `reputacao-online/AlertSettings.tsx` ✅ (0 erros)
- `reputacao-online/Dashboard.tsx` ✅ (0 erros)
- `reputacao-online/Inbox.tsx` ✅ (0 erros)
- `reputacao-online/ReviewCard.tsx` ✅ (0 erros)
- `reputacao-online/ReviewDetail.tsx` (1 erro)
- `staff-ai/StaffDashboard.tsx` ✅ (0 erros)
- `staff-ai/StaffOnboarding.tsx` ✅ (0 erros)
- `staff-ai/StaffAnnouncements.tsx` (2 erros)
- `staff-ai/StaffSchedule.tsx` (3 erros)
- `staff-ai/StaffTeam.tsx` (2 erros)

---

## 3. FICHEIROS SEM TIPOS (6 ficheiros — o grosso do trabalho restante)

Estes ficheiros foram renomeados .jsx→.tsx mas NÃO foram editados. Precisam de:
- Interfaces para props
- useState<T> generics
- Tipagem de function params
- catch (error: unknown)
- Remoção de imports não usados (especialmente `import React`)

| Ficheiro | Erros | Linhas | Notas |
|----------|-------|--------|-------|
| **DashboardBI.tsx** | 176 | 1825 | chart.js, DashboardAPI, jsPDF, MAIOR ficheiro |
| **GroupDetailView.tsx** | 106 | 1433 | CommunityAPI posts/comments, groups |
| **ProfileView.tsx** | 70 | 700 | CommunityAPI profiles, followers |
| **ProfilesTab.tsx** | 55 | 1024 | CommunityAPI profiles directory |
| **RfqTab.tsx** | 39 | ~400 | RFQ management, quotes |
| **GroupsView.tsx** | 36 | 716 | CommunityAPI groups listing |

**Total: ~482 erros nestas 6 views**

### Ficheiros completados pelos agents (JÁ têm tipos):
- FoodCostView.tsx ✅ (agent corrigiu)
- GastroLens.tsx ✅ (agent corrigiu)
- SupplierDetail.tsx ✅ (agent corrigiu)
- SearchView.tsx ✅ (agent corrigiu)
- RfqRequestsTab.tsx ✅ (agent corrigiu)
- OnboardingView.tsx ✅ (agent corrigiu)

---

## 4. PADRÕES DE ERROS E COMO CORRIGIR

### Padrão 1: `import React` não usado (TS6133)
```tsx
// ANTES
import React, { useState } from 'react';
// DEPOIS
import { useState } from 'react';
```

### Padrão 2: `useState([])` → tipo `never[]` (TS2322/TS2339)
```tsx
// ANTES
const [items, setItems] = useState([]);
// DEPOIS
interface Item { id: string; name: string; /* ... */ }
const [items, setItems] = useState<Item[]>([]);
```

### Padrão 3: `useState(null)` sem tipo (TS2339 ao aceder propriedades)
```tsx
// ANTES
const [stats, setStats] = useState(null);
stats.receita.value // TS2339!
// DEPOIS
interface Stats { receita: { value: number; formatted: string; }; /* ... */ }
const [stats, setStats] = useState<Stats | null>(null);
```

### Padrão 4: Parâmetros sem tipo (TS7006/TS7031)
```tsx
// ANTES
const handleClick = (id) => { ... }
const Component = ({ name, onSelect }) => { ... }
// DEPOIS
const handleClick = (id: string) => { ... }
interface ComponentProps { name: string; onSelect: (item: Item) => void; }
const Component = ({ name, onSelect }: ComponentProps) => { ... }
```

### Padrão 5: catch blocks (TS18046)
```tsx
// ANTES
catch (error) { console.error(error.message); }
// DEPOIS
catch (error: unknown) { console.error(error instanceof Error ? error.message : 'Unknown error'); }
```

### Padrão 6: `e.target.style` (TS2339 em EventTarget)
```tsx
// ANTES
onMouseEnter={(e) => { e.target.style.transform = '...'; }}
// DEPOIS
onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = '...'; }}
```

### Padrão 7: Index access em objetos (TS7053)
```tsx
// ANTES
const color = colors[status];
// DEPOIS
const color = colors[status as keyof typeof colors];
// OU
const getColor = (status: keyof typeof colors) => { ... }
```

### Padrão 8: jsPDF plugin (TS2339)
```tsx
// autoTable não está nos tipos do jsPDF
(doc as any).lastAutoTable  // para aceder a propriedades do plugin
(doc as any).internal.getNumberOfPages()  // se o tipo não reconhece
```

### Padrão 9: API response data (TS18046 unknown)
```tsx
// ANTES
const data = await CommunityAPI.getPosts();
setPosts(data.data);
// DEPOIS
const data = await CommunityAPI.getPosts() as Record<string, unknown>;
setPosts((data.data as Post[]) || []);
// OU MELHOR - definir interface de resposta
```

---

## 5. ABORDAGEM RECOMENDADA PARA CONTINUAR

### Passo 1: Corrigir os 12 ficheiros sem tipos
Para cada ficheiro (do menor ao maior):
1. Ler o ficheiro
2. Identificar interfaces necessárias (data shapes de API, props, state)
3. Adicionar interfaces no topo
4. Tipar useState generics
5. Tipar function params e event handlers
6. Fixar catch blocks e imports não usados
7. Escrever o ficheiro corrigido

### Passo 2: Corrigir erros residuais (~37 erros em ficheiros "quase completos")
- BenchmarkChart.tsx: 4 erros chart.js types
- StaffSchedule.tsx: 3 erros (unused vars + index)
- StaffTeam.tsx: 2 erros (index)
- StaffAnnouncements.tsx: 2 erros
- TopBar.tsx: 2 erros (API data typing)
- Outros: 1 erro cada

### Passo 3: Corrigir App.tsx (9 erros cascading)
Os erros do App.tsx são de componentes que definem props que o App não satisfaz. Quando os views estiverem tipados, estes erros resolvem-se ou ficam claros.

### Passo 4: Validação final
```bash
cd frontend/apps/prototype-vision
npx tsc --noEmit   # DEVE dar 0 erros (excluindo test/stories pré-existentes)
npx vite build     # DEVE passar (já passa)
```

### Passo 5: Commit
```bash
git add .
git commit -m "feat: migrate frontend from JSX/JS to TSX/TS with strict TypeScript [TECH-DEBT-002.1]"
```

---

## 6. CONTEXTO TÉCNICO

### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "jsx": "react-jsx"
  }
}
```

### Dependências relevantes para tipos
- `react` 18.2.0, `react-router-dom` v7
- `framer-motion` v11
- `chart.js` + `react-chartjs-2`
- `axios`
- `react-hot-toast`
- `lucide-react`
- `date-fns`
- `jspdf` + `jspdf-autotable`
- `zustand` v5

### API Data Shapes (referência rápida)
```typescript
// Posts (CommunityAPI)
interface Post {
  id: string; title: string; body: string; category: string;
  tags: string[]; createdAt: string; views: number;
  author: { userId: string; username: string; avatar?: string; };
  _count: { comments: number; reactions: number; };
  reactions?: Record<string, number>;
  group?: { id: string; name: string; };
}

// Groups (CommunityAPI)
interface Group {
  id: string; name: string; description: string;
  category: string; type: string; coverImage?: string;
  _count: { members: number; posts: number; };
}

// Profile (CommunityAPI)
interface Profile {
  id: string; userId: string; username: string;
  avatar?: string; bio?: string; restaurantName?: string;
  role?: string;
}

// Dashboard Stats (DashboardAPI)
interface DashboardStats {
  receita: { value: number; formatted: string; trend: string; isUp: boolean; vs: string; };
  clientes: { value: number; trend: string; isUp: boolean; vs: string; };
  ticketMedio: { value: number; formatted: string; trend: string; isUp: boolean; vs: string; };
  foodCost: { value: number; formatted: string; trend: string; isUp: boolean; vs: string; };
}
```

---

## 7. FICHEIROS NÃO INCLUÍDOS NA MIGRAÇÃO

Estes ficheiros já eram .tsx/.ts antes e têm erros pré-existentes (NÃO fazem parte desta migração):
- `components/ui/Card.stories.tsx` (78 erros)
- `components/ui/Card.test.tsx` (41 erros)
- `components/ui/Accessibility.test.tsx` (17 erros)
- `components/ui/Input.test.tsx` (7 erros)
- Outros test/stories files

---

**FIM DO HANDOFF — Migração TS Frontend**
**Criado por:** Dex (@dev)
**Working tree:** DIRTY (alterações por commitar)
**Branch:** main
