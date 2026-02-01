# ADR-001: Arquitetura de Microserviços

## Status

Aceite

## Data

2026-01-31

## Contexto

O iaMenu Ecosystem é uma plataforma complexa para restaurantes portugueses que combina múltiplas funcionalidades:
- **Community**: Hub social com fórum, grupos e gamificação
- **Marketplace**: Conexão com fornecedores, RFQs e negociações
- **Academy**: Cursos e certificações
- **Business Intelligence**: Analytics e dashboards

Precisávamos decidir como estruturar o backend para suportar estas funcionalidades distintas, considerando:
- Equipas potencialmente diferentes para cada domínio
- Escalabilidade independente por serviço
- Manutenibilidade a longo prazo
- Velocidade de desenvolvimento inicial

## Decisão

Adotamos uma **arquitetura de microserviços** com 4 serviços Node.js independentes:

```
services/
├── community/     # Porta 3001
├── marketplace/   # Porta 3002
├── academy/       # Porta 3003
└── business/      # Porta 3004
```

Cada serviço:
- É um projeto Node.js/Express independente
- Tem o seu próprio schema na base de dados
- Pode ser deployado independentemente
- Segue a mesma estrutura interna (controllers, services, routes, middleware)

## Consequências

### Positivas
- **Separação de responsabilidades**: Cada serviço tem um domínio bem definido
- **Deploy independente**: Podemos atualizar um serviço sem afetar os outros
- **Escalabilidade**: Podemos escalar serviços individualmente (ex: Community pode precisar de mais recursos)
- **Tecnologia flexível**: Podemos usar tecnologias diferentes por serviço se necessário
- **Equipas autónomas**: Diferentes equipas podem trabalhar em paralelo

### Negativas
- **Complexidade operacional**: Mais serviços para monitorizar e manter
- **Comunicação inter-serviços**: Não implementada ainda, pode ser necessária no futuro
- **Overhead de desenvolvimento**: Código duplicado entre serviços (auth, error handling)
- **Debugging distribuído**: Mais difícil rastrear problemas que cruzam serviços

### Neutras
- Cada serviço tem as suas próprias dependências npm
- Testes são executados por serviço
- Logs são separados por serviço

## Alternativas Consideradas

### Monolito Modular
- **Descrição**: Um único serviço Node.js com módulos internos
- **Prós**: Simplicidade, sem overhead de rede, transações fáceis
- **Contras**: Acoplamento, deploy único, escalabilidade limitada
- **Razão da rejeição**: Limitaria escalabilidade futura e independência de equipas

### Serverless (AWS Lambda / Vercel Functions)
- **Descrição**: Funções individuais por endpoint
- **Prós**: Escala automática, custo por uso
- **Contras**: Cold starts, complexidade de estado, vendor lock-in
- **Razão da rejeição**: Overhead de gestão, latência em cold starts

## Referências

- [Microservices.io](https://microservices.io/)
- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)
