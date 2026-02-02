# Tech Stack - iaMenu Ecosystem

## Visão Geral

O iaMenu Ecosystem usa uma arquitetura de microserviços com 4 serviços Node.js independentes e um frontend React.

## Backend

### Runtime & Framework
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 18+ | Runtime |
| TypeScript | 5.3+ | Linguagem |
| Express.js | 4.x | Framework HTTP |
| Prisma | 5.7+ | ORM |

### Base de Dados
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| PostgreSQL | 16 | Base de dados principal |
| Multi-Schema | - | Schema separado por serviço |

### Autenticação & Segurança
| Tecnologia | Uso |
|------------|-----|
| jsonwebtoken | JWT tokens |
| bcrypt | Hash de passwords |
| helmet | Headers de segurança |
| cors | Cross-Origin Resource Sharing |

### Comunicação em Tempo Real
| Tecnologia | Uso |
|------------|-----|
| Socket.io | WebSockets (Community service) |

### Validação & Uploads
| Tecnologia | Uso |
|------------|-----|
| express-validator | Validação de inputs |
| multer | Upload de ficheiros |

### Logging & Monitoring
| Tecnologia | Uso |
|------------|-----|
| winston | Logging estruturado |
| morgan | HTTP request logging |

### Processamento de Ficheiros
| Tecnologia | Uso |
|------------|-----|
| ExcelJS | Leitura/escrita Excel |
| XLSX | Parsing de spreadsheets |

## Frontend

### Core
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2 | Framework UI |
| Vite | 5.2 | Build tool |
| React Router | 7.11 | Routing |

### Styling
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Tailwind CSS | 3.4 | Utility-first CSS |
| Framer Motion | 11.0 | Animações |

### Data & State
| Tecnologia | Uso |
|------------|-----|
| Zustand | State management |
| Axios | HTTP client |

### Visualização
| Tecnologia | Uso |
|------------|-----|
| Chart.js | Gráficos |
| react-chartjs-2 | React wrapper para Chart.js |

### Utilidades
| Tecnologia | Uso |
|------------|-----|
| date-fns | Manipulação de datas |
| jsPDF | Geração de PDFs |
| react-markdown | Renderização de Markdown |
| Lucide React | Ícones |
| react-hot-toast | Notificações toast |

### IA
| Tecnologia | Uso |
|------------|-----|
| @google/generative-ai | Integração com Gemini |

## DevOps

### Containerização
| Tecnologia | Uso |
|------------|-----|
| Docker | Containers |
| Docker Compose | Orquestração local |

### Deploy
| Plataforma | Uso |
|------------|-----|
| Railway | Backend services |
| Vercel | Frontend |

### CI/CD
| Tecnologia | Uso |
|------------|-----|
| GitHub Actions | Pipelines CI/CD |

## Portas de Desenvolvimento

| Serviço | Porta |
|---------|-------|
| Community API | 3001 |
| Marketplace API | 3002 |
| Academy API | 3003 |
| Business API | 3004 |
| Frontend | 5173 |
| PostgreSQL | 5432 |
