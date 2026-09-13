# Cric - Turborepo Monorepo (Next.js + Express.js)

A production-ready Turborepo monorepo featuring a **Next.js 14 (App Router)** frontend and an **Express.js** backend with session-based authentication, in-memory database, and HLS.js live video streaming player.

## Repository Architecture

```
cric/
├── apps/
│   ├── api/                     # Express.js backend API (Port 5000)
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   └── memoryDb.js  # In-memory datastore with bcrypt hashing
│   │   │   ├── middleware/
│   │   │   │   └── auth.js      # Session authentication guard
│   │   │   ├── routes/
│   │   │   │   ├── auth.js      # /api/auth (login, register, me, logout)
│   │   │   │   └── stream.js    # /api/stream (live stream endpoints)
│   │   │   └── server.js        # Express server entry point
│   │   ├── .env.example
│   │   └── package.json
│   └── web/                     # Next.js 14 frontend (Port 3000)
│       ├── app/
│       │   ├── login/page.js    # Modern glassmorphic Login page
│       │   ├── register/page.js # Modern Registration page
│       │   ├── globals.css      # Tailwind & global styles
│       │   ├── layout.js        # Root application layout
│       │   └── page.js          # Protected Live IPTV player dashboard
│       ├── components/
│       │   ├── Navbar.js        # Sticky top navigation bar
│       │   └── VideoPlayer.js   # HLS.js video playback component
│       ├── next.config.js       # Next.js config with API proxy rewrites
│       ├── tailwind.config.js
│       ├── .env.example
│       └── package.json
├── package.json                 # Turborepo root workspace configuration
├── turbo.json                   # Turborepo task pipeline
└── README.md
```

## Quick Start

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 10.0.0

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
Using Turborepo, start both frontend (`web`) and backend (`api`) concurrently with a single command:

```bash
npm run dev
```

- **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- **Backend (Express API):** [http://localhost:5000](http://localhost:5000)

### 4. Build for Production
```bash
npm run build
```

## Demo Credentials
An initial user is automatically seeded in the in-memory database:
- **Username:** `demo_user` (or `demo@example.com`)
- **Password:** `password123`
*(A 1-click "Fill Demo" button is also provided on the login page)*

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status | No |
| `POST` | `/api/auth/login` | Authenticate & start session | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `GET` | `/api/auth/me` | Fetch active user session | Yes |
| `POST` | `/api/auth/logout` | Terminate session & clear cookie | Yes |
| `GET` | `/api/stream/info` | Live stream metadata and URL | Yes |
