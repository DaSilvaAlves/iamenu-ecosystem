# Academy API 🎓

> **iaMenu Academia** - Courses, Certific ates, Learning Platform

## Features
- Course Catalog
- Video Player & Progress Tracking
- Certificates (PDF + shareable)
- Quizzes
- 3 Initial Courses (iaMenu 101, Negociação, Marketing)

## Quick Start
```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

**Port:** `3003`
**Health:** `http://localhost:3003/health`

## Database
**Schema:** `academy`
**Tables:** courses, modules, lessons, enrollments, lesson_progress, certificates

## Status
🚧 Boilerplate pronto, rotas Semana 5-6
