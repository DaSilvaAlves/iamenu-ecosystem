# ADR-005: Real-time com Socket.io (Community Only)

## Status

Aceite

## Data

2026-01-31

## Contexto

O serviço Community precisa de funcionalidades real-time:
- Notificações instantâneas
- Atualizações de posts/comentários em tempo real
- Indicadores de presença (quem está online)
- Chat em grupos (futuro)

Outros serviços (Marketplace, Academy, Business) não têm requisitos real-time imediatos.

## Decisão

Implementamos **Socket.io apenas no serviço Community**, na mesma porta do HTTP:

```typescript
// services/community/src/index.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN }
});

io.on('connection', (socket) => {
  socket.on('join:user', (userId) => {
    socket.join(`user:${userId}`);
  });
});

// Emitir notificação
io.to(`user:${userId}`).emit('notification', payload);
```

**Porta única**: HTTP e WebSocket na porta 3001.

## Consequências

### Positivas
- **Simplicidade**: Socket.io é fácil de usar
- **Fallback automático**: Long-polling se WebSocket falhar
- **Rooms nativas**: Fácil agrupar conexões por user/group
- **Integração Express**: Mesmo servidor, mesma porta
- **Isolamento**: Apenas Community tem overhead de WebSocket

### Negativas
- **Não distribuído**: Sem Redis adapter, não escala horizontalmente
- **Estado em memória**: Conexões perdidas em restart
- **Apenas Community**: Outros serviços não podem emitir eventos real-time
- **Vendor lock-in**: Protocolo Socket.io específico

### Neutras
- Frontend usa socket.io-client
- Reconexão automática configurada
- Heartbeat padrão de 25s

## Alternativas Consideradas

### Server-Sent Events (SSE)
- **Descrição**: Stream unidirecional HTTP
- **Prós**: Simples, HTTP nativo, sem biblioteca
- **Contras**: Apenas server→client, reconexão manual
- **Razão da rejeição**: Precisamos de bidireccional para presença

### WebSocket Puro
- **Descrição**: WebSocket nativo sem Socket.io
- **Prós**: Standard, sem overhead de biblioteca
- **Contras**: Sem rooms, sem fallback, mais código
- **Razão da rejeição**: Socket.io simplifica significativamente

### Serviço de Real-time Dedicado
- **Descrição**: Microserviço separado para WebSocket
- **Prós**: Escalabilidade, isolamento
- **Contras**: Complexidade, comunicação inter-serviços
- **Razão da rejeição**: Over-engineering para a escala atual

### Pusher/Ably (SaaS)
- **Descrição**: Serviço gerido de real-time
- **Prós**: Escalável, sem manutenção, features prontas
- **Contras**: Custo, vendor lock-in, latência
- **Razão da rejeição**: Custo e dependência externa

## Escalabilidade Futura

Para escalar horizontalmente:

```typescript
// Adicionar Redis Adapter
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));
```

## Eventos Implementados

| Evento | Direção | Descrição |
|--------|---------|-----------|
| `join:user` | Client→Server | Subscrever notificações do user |
| `notification` | Server→Client | Nova notificação |
| `post:new` | Server→Client | Novo post no grupo |
| `comment:new` | Server→Client | Novo comentário |

## Referências

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Socket.io Redis Adapter](https://socket.io/docs/v4/redis-adapter/)
