# ADR-006: Deploy Railway + Vercel

## Status

Aceite

## Data

2026-01-31

## Contexto

Precisávamos de uma estratégia de deployment para:
- 4 serviços Node.js backend
- 1 frontend React SPA
- 1 base de dados PostgreSQL
- Custos controlados para startup
- Deploy simples sem DevOps dedicado

## Decisão

Adotamos uma estratégia híbrida de PaaS:

**Backend (Railway):**
- 4 serviços Node.js deployados independentemente
- PostgreSQL gerido
- Auto-deploy via GitHub

**Frontend (Vercel):**
- React SPA com Vite
- CDN global
- Preview deploys por PR

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel CDN                          │
│              prototype-vision.vercel.app                 │
└─────────────────────────────┬───────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Railway     │  │   Railway     │  │   Railway     │
│  Community    │  │  Marketplace  │  │   Academy     │
│    :3001      │  │    :3002      │  │    :3003      │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                   │
        └──────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Railway    │
                    │ PostgreSQL  │
                    └─────────────┘
```

**URLs de Produção:**
- Frontend: `https://prototype-vision.vercel.app`
- Community: `https://iamenucommunity-api-production.up.railway.app`
- Marketplace: `https://iamenumarketplace-api-production.up.railway.app`
- Academy: `https://iamenuacademy-api-production.up.railway.app`
- Business: `https://iamenubusiness-api-production.up.railway.app`

## Consequências

### Positivas
- **Zero DevOps**: Sem servidores para gerir
- **Auto-scaling**: Railway escala automaticamente
- **Deploy automático**: Push to main = deploy
- **Preview environments**: Vercel cria preview por PR
- **SSL automático**: HTTPS incluído
- **Custo previsível**: Pay-as-you-go

### Negativas
- **Vendor lock-in**: Migração requer trabalho
- **Cold starts**: Possíveis em planos gratuitos/básicos
- **Limitações de customização**: Menos controlo que VPS
- **Custos podem escalar**: Com uso intensivo

### Neutras
- Logs centralizados por plataforma
- Métricas básicas incluídas
- Variáveis de ambiente via dashboard

## Alternativas Consideradas

### AWS/GCP/Azure (IaaS)
- **Descrição**: VMs ou containers geridos
- **Prós**: Controlo total, todos os serviços
- **Contras**: Complexidade, requer DevOps, custo inicial
- **Razão da rejeição**: Overhead para equipa pequena

### DigitalOcean App Platform
- **Descrição**: PaaS similar a Railway
- **Prós**: Preços competitivos, simples
- **Contras**: Menos features que Railway
- **Razão da rejeição**: Railway tem melhor DX para Node.js

### Self-hosted (VPS)
- **Descrição**: Docker em VPS (Hetzner, OVH)
- **Prós**: Custo fixo baixo, controlo total
- **Contras**: Manutenção, updates, segurança
- **Razão da rejeição**: Requer tempo de manutenção

### Fly.io
- **Descrição**: Edge computing platform
- **Prós**: Global distribution, containers
- **Contras**: Curva de aprendizagem, CLI-focused
- **Razão da rejeição**: Railway mais simples para iniciar

## Configuração

**Railway (`railway.json`):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

**Vercel (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Custos Estimados

| Componente | Plano | Custo/mês |
|------------|-------|-----------|
| Railway (4 services) | Pro | ~$20-40 |
| Railway PostgreSQL | Pro | ~$5-15 |
| Vercel | Pro | $20 |
| **Total** | | **~$45-75** |

## Referências

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
