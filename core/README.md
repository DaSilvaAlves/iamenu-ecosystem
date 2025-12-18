# iaMenu Core API (Java Spring Boot) ☕

> **Backend principal**: Menu Digital, Auth, Orders, IA Chat

---

## 📦 Stack

- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA** (Hibernate)
- **PostgreSQL 16** (schema: `public.*`)
- **OpenAI GPT-4-Turbo**
- **Custom JWT** Auth
- **Maven**

---

## 🚀 Como Usar

### 1. Copiar Código Existente

**⚠️ IMPORTANTE**: Esta pasta deve conter o código Java existente do repo `menuia`.

```bash
# Copiar src/ e pom.xml do repo menuia:
# 1. Abrir repo menuia
# 2. Copiar pasta src/ para core/src/
# 3. Copiar pom.xml para core/pom.xml
# 4. Copiar Dockerfile (se existe) para core/Dockerfile
```

### 2. Build & Run Local

```bash
cd core

# Build
mvn clean install

# Run
mvn spring-boot:run

# OU via Java direto:
java -jar target/iamenu-api-1.0.0.jar
```

**Porta:** `8080`

**Endpoints:**
- Health: `http://localhost:8080/actuator/health`
- API: `http://localhost:8080/api/*`

### 3. Docker Build

```bash
docker build -t iamenu-api:latest .
docker run -p 8080:8080 -e DATABASE_URL="..." iamenu-api:latest
```

---

## 📝 Environment Variables

Criar `core/src/main/resources/application-dev.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

openai:
  api-key: ${OPENAI_API_KEY}

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000  # 24h
```

---

## 🔗 Integrações

**Comunica com:**
- PostgreSQL (schema `public.*`)
- OpenAI API (GPT-4-Turbo)
- Stripe API (payments)

**Usado por:**
- Frontend Menu Digital
- Services Node.js (validam JWT aqui gerado)

---

## 📂 Estrutura (Esperada após copiar)

```
core/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── pt/iamenu/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── config/
│   │   │       └── IaMenuApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.yml
│   └── test/
├── pom.xml
├── Dockerfile
└── README.md (este ficheiro)
```

---

## 🧪 Testing

```bash
mvn test
```

---

## 🚢 Deploy Railway

```bash
# Railway detecta automaticamente:
# - pom.xml → Maven build
# - Dockerfile → Docker build

# Variables Railway:
# DATABASE_URL, OPENAI_API_KEY, JWT_SECRET
```

---

**Status:** 🚧 Aguarda código do repo `menuia`
**Owner:** Eurico Alves
**Port:** 8080
