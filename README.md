# 🌐 ShortUrl — Modern React Frontend

A fast, responsive web application for creating, managing, and tracking short URLs. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **shadcn/ui**.

> 🔗 **Backend API Repository:** [sagr612/shorturl_backend](https://github.com/sagr612/shorturl_backend)  
> This frontend is designed to run independently and communicates with the Spring Boot 3 + Redis + PostgreSQL backend via REST APIs.

---

## ✨ Features

- **⚡ Instant URL Shortening:** Shorten long links with custom expiration (days) and public/private visibility toggles.
- **📊 My URLs Dashboard:** Paginated list of user links with live click counts, search filtering, sorting, and direct clipboard copying.
- **🔐 JWT Auth with Silent Token Refresh:**
  - Stateless authentication with short-lived access tokens.
  - Automated Axios response interceptor with **single-flight promise deduplication** (`refreshPromise`) to prevent 401 refresh storms across concurrent requests.
  - Full support for backend refresh token rotation.
- **🛡️ Role-Based Admin Panel (`ROLE_ADMIN`):**
  - Protected admin routes for platform monitoring.
  - Manage all platform users, view platform-wide click statistics, and perform bulk URL deletions with optimistic UI updates.
- **👤 User Profile & Analytics:** Track personal usage, total clicks generated, and active vs. expired URLs.
- **🎨 Modern UI & Theming:** Clean, accessible design powered by Tailwind CSS v4, Lucide icons, Sonner toast notifications, and dark/light mode via `next-themes`.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons & Notifications:** [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/)
- **HTTP Client:** [Axios](https://axios-http.com/) with custom JWT request & response interceptors
- **JWT Utilities:** `jwt-decode`

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI & feature components
│   ├── ui/              # shadcn/ui primitives (button, badge, dialog, tabs, etc.)
│   ├── AdminDashboard   # Platform analytics & user management
│   ├── CreateShortUrl   # URL shortening form
│   ├── EditUrlModal     # Inline URL modification
│   ├── Login / Signup   # Auth forms
│   └── ProtectedRoute   # Route guards (Auth & Admin)
├── contexts/            # React Context providers (AuthContext, UserContext)
├── hooks/               # Custom hooks (useUrls, useUserProfile)
├── lib/                 # Utility functions, type-safe error parsers, validation
├── services/            # Axios API clients (api, authService, shortUrlService, adminService)
└── types/               # TypeScript interfaces & DTOs
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# URL of the running shorturl_backend instance
VITE_API_URL=http://localhost:8080
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend REST API | `http://localhost:8080` |

> When deploying to production (e.g. Vercel, Netlify), set `VITE_API_URL` in your platform's environment variables dashboard to point to your live backend domain (e.g. `https://api.yourdomain.com`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Compiles TypeScript and outputs optimized, minified production assets to `/dist`.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 🚀 Deployment (Vercel / Netlify / Cloudflare Pages)

This project includes a `vercel.json` rewrite configuration for Single Page Application (SPA) routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

1. Import the repository into your hosting platform (e.g., [Vercel](https://vercel.com)).
2. Set Framework Preset: **Vite**.
3. Add Environment Variable: `VITE_API_URL = https://your-backend-api.com`.
4. Deploy!
