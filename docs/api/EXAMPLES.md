# API Examples - cURL Requests

**Document:** API Request Examples
**Date:** 2026-02-10
**Format:** cURL (shell commands)

## Prerequisites

```bash
# 1. Start all services
npm run dev

# 2. Get a valid JWT token (usually from login)
export TOKEN="your-jwt-token-here"

# For local development, you can use the dev token:
export TOKEN=$(cat frontend/apps/prototype-vision/src/config/devToken.js | grep -oP '(?<=")[^"]*(?=")' | head -1)
```

---

## Community API Examples

### Posts

#### List all posts (PUBLIC)
```bash
curl -X GET http://localhost:3001/api/v1/community/posts \
  -H "Content-Type: application/json"
```

**With pagination and search:**
```bash
curl -X GET "http://localhost:3001/api/v1/community/posts?limit=10&offset=0&search=testing&sort=created_at:desc" \
  -H "Content-Type: application/json"
```

#### Create new post (AUTHENTICATED)
```bash
curl -X POST http://localhost:3001/api/v1/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo artigo sobre gestão",
    "body": "Conteúdo detalhado sobre as melhores práticas de gestão de restaurantes...",
    "category": "management",
    "tags": "gestão,melhores-práticas"
  }'
```

#### Get specific post (PUBLIC)
```bash
curl -X GET http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

#### Update post (AUTHENTICATED, owner only)
```bash
curl -X PATCH http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título atualizado",
    "status": "active"
  }'
```

#### Delete post (AUTHENTICATED, owner only)
```bash
curl -X DELETE http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

### Comments

#### Get post comments (PUBLIC)
```bash
curl -X GET http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000/comments \
  -H "Content-Type: application/json"
```

#### Create comment (AUTHENTICATED)
```bash
curl -X POST http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Excelente dica! Vou implementar isto no meu restaurante."
  }'
```

### Reactions

#### Get post reactions (PUBLIC)
```bash
curl -X GET http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000/reactions \
  -H "Content-Type: application/json"
```

#### Toggle reaction (AUTHENTICATED)
```bash
curl -X POST http://localhost:3001/api/v1/community/posts/550e8400-e29b-41d4-a716-446655440000/react \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "👍"
  }'
```

### Groups

#### List user's groups (AUTHENTICATED)
```bash
curl -X GET http://localhost:3001/api/v1/community/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Create group (AUTHENTICATED)
```bash
curl -X POST http://localhost:3001/api/v1/community/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurantes Portugueses",
    "description": "Grupo de discussão para restaurantes tradicionais",
    "privacy": "public"
  }'
```

### Notifications

#### List user's notifications (AUTHENTICATED, STRICT)
```bash
curl -X GET http://localhost:3001/api/v1/community/notifications?limit=20 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Mark notification as read (AUTHENTICATED)
```bash
curl -X POST http://localhost:3001/api/v1/community/notifications/550e8400-e29b-41d4-a716-446655440000/read \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## Marketplace API Examples

### Suppliers

#### List all suppliers (PUBLIC, RLS filtered)
```bash
curl -X GET http://localhost:3002/api/v1/marketplace/suppliers \
  -H "Content-Type: application/json"
```

**With filters:**
```bash
curl -X GET "http://localhost:3002/api/v1/marketplace/suppliers?search=Frutas&verified=true&limit=10" \
  -H "Content-Type: application/json"
```

#### Create supplier (AUTHENTICATED)
```bash
curl -X POST http://localhost:3002/api/v1/marketplace/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Frutas da Terra",
    "email": "contact@frutas.pt",
    "phone": "+351910123456",
    "description": "Fornecimento de frutas e legumes frescos",
    "categories": ["fruits", "vegetables"],
    "deliveryArea": "Lisboa",
    "minOrderValue": 50.00
  }'
```

#### Get supplier details (PUBLIC, RLS filtered)
```bash
curl -X GET http://localhost:3002/api/v1/marketplace/suppliers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

### Reviews

#### Get supplier reviews (PUBLIC)
```bash
curl -X GET "http://localhost:3002/api/v1/marketplace/suppliers/550e8400-e29b-41d4-a716-446655440000/reviews?sort=recent" \
  -H "Content-Type: application/json"
```

#### Create review (AUTHENTICATED, verified customers only)
```bash
curl -X POST http://localhost:3002/api/v1/marketplace/suppliers/550e8400-e29b-41d4-a716-446655440000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Excelente qualidade",
    "comment": "Frutas sempre frescas e entrega rápida. Recomendo!"
  }'
```

### Quotes

#### List quotes (AUTHENTICATED, RLS filtered)
```bash
curl -X GET "http://localhost:3002/api/v1/marketplace/quotes?status=pending" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Create quote (AUTHENTICATED - supplier only)
```bash
curl -X POST http://localhost:3002/api/v1/marketplace/quotes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quoteRequestId": "550e8400-e29b-41d4-a716-446655440000",
    "totalPrice": 250.00,
    "itemDetails": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440001",
        "quantity": 10,
        "unitPrice": 20.00
      }
    ],
    "deliveryDate": "2026-02-15",
    "deliveryFee": 10.00,
    "paymentTerms": "Net 30"
  }'
```

### Collective Bargains

#### List active bargains (PUBLIC)
```bash
curl -X GET http://localhost:3002/api/v1/marketplace/bargains \
  -H "Content-Type: application/json"
```

#### Join bargain (AUTHENTICATED)
```bash
curl -X POST http://localhost:3002/api/v1/marketplace/bargains/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50
  }'
```

---

## Academy API Examples

### Courses

#### List courses (PUBLIC - published only)
```bash
curl -X GET "http://localhost:3003/api/v1/academy/courses?published=true&level=beginner" \
  -H "Content-Type: application/json"
```

#### Create course (AUTHENTICATED - instructor)
```bash
curl -X POST http://localhost:3003/api/v1/academy/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gestão de Custos em Restaurantes",
    "description": "Aprenda técnicas modernas para controlar custos",
    "category": "restaurant-management",
    "level": "intermediate",
    "price": 49.99
  }'
```

#### Get course details (PUBLIC, respects publication status)
```bash
curl -X GET http://localhost:3003/api/v1/academy/courses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

### Enrollments

#### List user's enrollments (AUTHENTICATED, STRICT)
```bash
curl -X GET http://localhost:3003/api/v1/academy/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Enroll in course (AUTHENTICATED)
```bash
curl -X POST http://localhost:3003/api/v1/academy/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

#### Update progress (AUTHENTICATED)
```bash
curl -X PATCH http://localhost:3003/api/v1/academy/enrollments/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lastAccessedLessonId": "550e8400-e29b-41d4-a716-446655440002",
    "completedLessonId": "550e8400-e29b-41d4-a716-446655440002"
  }'
```

### Certificates

#### List user's certificates (AUTHENTICATED, STRICT)
```bash
curl -X GET http://localhost:3003/api/v1/academy/certificates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Verify certificate (PUBLIC)
```bash
curl -X GET "http://localhost:3003/api/v1/academy/certificates/verify/CERT-2026-001-ABC123" \
  -H "Content-Type: application/json"
```

---

## Business API Examples

### Dashboard

#### Get general statistics (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/stats?period=week" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get top products (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/top-products?limit=10&period=month&sortBy=revenue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get critical alerts (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/alerts?severity=critical" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get business opportunities (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/opportunities?priority=high" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get sales trends (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/sales-trends?period=month&groupBy=day" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get AI prediction (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/ai-prediction?focusArea=revenue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get menu engineering (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/menu-engineering?period=month" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get demand forecast (AUTHENTICATED)
```bash
curl -X GET http://localhost:3004/api/v1/business/dashboard/demand-forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get peak hours heatmap (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/peak-hours-heatmap?period=week" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

#### Get benchmark data (AUTHENTICATED)
```bash
curl -X GET "http://localhost:3004/api/v1/business/dashboard/benchmark?metrics=revenue,avg_ticket,customer_count" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## Error Handling Examples

### Missing Authentication
```bash
curl -X GET http://localhost:3001/api/v1/community/notifications

# Response 401:
{
  "error": "INVALID_TOKEN",
  "message": "JWT token is missing or invalid",
  "statusCode": 401,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

### Validation Error
```bash
curl -X POST http://localhost:3001/api/v1/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hi"}' # Body too short

# Response 400:
{
  "error": "VALIDATION_ERROR",
  "message": "Post body must be at least 10 characters",
  "statusCode": 400,
  "timestamp": "2026-02-10T15:30:00Z",
  "details": {
    "field": "body",
    "constraint": "minLength"
  }
}
```

### Forbidden (RLS Violation)
```bash
curl -X GET http://localhost:3003/api/v1/academy/enrollments/someone-elses-enrollment-id \
  -H "Authorization: Bearer $TOKEN"

# Response 403:
{
  "error": "FORBIDDEN",
  "message": "Access denied - insufficient permissions",
  "statusCode": 403,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

### Not Found
```bash
curl -X GET http://localhost:3001/api/v1/community/posts/00000000-0000-0000-0000-000000000000

# Response 404:
{
  "error": "NOT_FOUND",
  "message": "Post with ID not found",
  "statusCode": 404,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

---

## Batch Testing Script

Save as `test-apis.sh`:

```bash
#!/bin/bash

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "Usage: ./test-apis.sh <JWT_TOKEN>"
  exit 1
fi

echo "🧪 Testing iaMenu APIs..."

echo "\n✅ Community API"
curl -s http://localhost:3001/api/v1/community/posts | jq '.data | length' > /dev/null && echo "✓ Posts OK"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/v1/community/notifications | jq '.data | length' > /dev/null && echo "✓ Notifications OK"

echo "\n✅ Marketplace API"
curl -s http://localhost:3002/api/v1/marketplace/suppliers | jq '.data | length' > /dev/null && echo "✓ Suppliers OK"
curl -s http://localhost:3002/api/v1/marketplace/bargains | jq '.data | length' > /dev/null && echo "✓ Bargains OK"

echo "\n✅ Academy API"
curl -s http://localhost:3003/api/v1/academy/courses | jq '.data | length' > /dev/null && echo "✓ Courses OK"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3003/api/v1/academy/enrollments | jq '.data | length' > /dev/null && echo "✓ Enrollments OK"

echo "\n✅ Business API"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3004/api/v1/business/dashboard/stats | jq '.data.totalRevenue' > /dev/null && echo "✓ Dashboard OK"

echo "\n✅ All APIs responding correctly!"
```

Usage:
```bash
chmod +x test-apis.sh
./test-apis.sh "eyJhbGc..."
```

---

## Tools for Testing

### Postman
```
Import: File → Import → Folder
Select: docs/api/
Collections auto-created from OpenAPI specs
```

### Insomnia
```
Import: File → Import → From URL
Paste: docs/api/openapi-community.yaml
Repeat for each service
```

### HTTPie (modern curl)
```bash
http GET localhost:3001/api/v1/community/posts
http POST localhost:3001/api/v1/community/posts \
  "Authorization: Bearer $TOKEN" \
  title="New Post" body="Content..."
```

---

**Last Updated:** 2026-02-10
**Format:** cURL / Bash
**Status:** Phase C Complete
