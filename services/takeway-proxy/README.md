# iaMenu Takeway Proxy

Secure proxy API that bridges the frontend and Supabase for the iaMenu Takeway ordering system.

## 🚀 Features

- ✅ CRUD operations for menu items
- ✅ CRUD operations for categories
- ✅ Daily specials management
- ✅ Image upload to Supabase Storage
- ✅ Secure credentials handling
- ✅ CORS enabled for frontend

## 🏗️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Variables

Create a `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3006
```

⚠️ **NEVER** commit the `.env` file or expose the `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

## 🚀 Development

```bash
npm run dev
```

Server runs on `http://localhost:3006`

## 🏭 Production Build

```bash
npm run build
npm start
```

## 🌐 Deploy to Railway

### Step 1: Push to GitHub

```bash
cd /path/to/iamenu-ecosystem
git add services/takeway-proxy
git commit -m "chore: prepare takeway-proxy for production deploy"
git push origin main
```

### Step 2: Deploy on Railway

1. Go to https://railway.app and create account
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account
5. Select the `iamenu-ecosystem` repository
6. Railway will auto-detect the service at `services/takeway-proxy`

### Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

- `SUPABASE_URL` = `https://fssyygsbhvvqhvfecqub.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (your service role key from Supabase dashboard)

### Step 4: Deploy!

Railway will automatically:
- Run `npm install`
- Run `npm run build` (compile TypeScript)
- Run `npm start` (start the server)

Your proxy will be available at: `https://your-app.up.railway.app`

## 📡 API Endpoints

### Menu Items
- `GET /api/supabase/menu-items` - List all items
- `POST /api/supabase/menu-items` - Create item (with image upload)
- `PUT /api/supabase/menu-items/:id` - Update item
- `DELETE /api/supabase/menu-items/:id` - Delete item

### Categories
- `GET /api/supabase/categories` - List all categories
- `POST /api/supabase/categories` - Create category
- `PUT /api/supabase/categories/:id` - Update category
- `DELETE /api/supabase/categories/:id` - Delete category

### Daily Specials
- `GET /api/supabase/daily-specials` - List today's specials
- `GET /api/supabase/daily-specials?date=YYYY-MM-DD` - List specials for date
- `POST /api/supabase/menu-items/:id/set-daily-special` - Mark as daily special
  - Body: `{ "special_date": "2026-01-11", "special_price": 9.99 }`
- `DELETE /api/supabase/menu-items/:id/remove-daily-special` - Remove from specials

## 🔐 Security

- Service role key is never exposed to frontend
- CORS configured for authorized origins
- All Supabase operations go through this proxy
- Follows military-grade security guidelines

## 📝 Project Structure

```
takeway-proxy/
├── src/
│   ├── server.ts          # Express server setup
│   └── supabaseRoutes.ts  # API routes
├── dist/                  # Compiled JavaScript (production)
├── migrations/            # Database migrations
├── .env                   # Environment variables (DO NOT COMMIT)
├── .gitignore
├── package.json
├── tsconfig.json
└── railway.json           # Railway deployment config
```

## 🧪 Testing

```bash
# Test proxy is running
curl http://localhost:3006/api/test-proxy

# Test menu items endpoint
curl http://localhost:3006/api/supabase/menu-items

# Test daily specials
curl http://localhost:3006/api/supabase/daily-specials
```

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for iaMenu Ecosystem**
