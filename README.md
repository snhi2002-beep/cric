# Cric IPTV - Live Streaming Application with Session Authentication

A production-ready Node.js and Express.js web application with modern session-based authentication, an in-memory database, and HLS.js live streaming player.

## Features

- **Session-Based Authentication**: Secure cookie sessions via `express-session` with session fixation protection.
- **In-Memory Database**: High-performance in-memory datastore with bcrypt-hashed passwords and indexing by username and email.
- **Production-Level Architecture**:
  - Modular routing (`routes/auth.js`, `routes/player.js`).
  - Auth route protection middleware (`middleware/auth.js`).
  - Centralized 404 and global 500 error handling with graceful process shutdown.
  - Flash notifications for error and success alerts.
- **Modern UI**:
  - Glassmorphic dark aesthetic for Login and Register pages with ambient glowing accents.
  - Responsive live stream player with header status indicator, user badge, and controls.

## Pre-configured Demo Account

An initial user is automatically seeded in the in-memory database on startup:
- **Username:** `demo_user` (or email: `demo@example.com`)
- **Password:** `password123`

You can also register new accounts directly from the `/register` page.

## Project Structure

```
├── db/
│   └── memoryDb.js          # In-memory user database with bcrypt hashing & indices
├── middleware/
│   └── auth.js              # Protected & guest route authorization middleware
├── public/
│   ├── css/
│   │   ├── auth.css         # Modern styling for Login/Register/Error pages
│   │   └── style.css        # Player & navbar interface styling
│   └── js/
│       └── player.js        # HLS video player logic & controls
├── routes/
│   ├── auth.js              # /login, /register, /logout routes with validation
│   └── player.js            # / protected player route
├── views/
│   ├── 404.ejs              # Page Not Found view
│   ├── error.ejs            # Server Error view
│   ├── index.ejs            # Protected IPTV player dashboard
│   ├── login.ejs            # Modern login interface
│   └── register.ejs         # Modern registration interface
├── .env.example             # Example environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main Express server entry point
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```

### 3. Run the Application
```bash
# Start production server
npm start

# Or run in development mode (with nodemon auto-restart)
npm run dev
```

Navigate to `http://localhost:3000` in your web browser. Unauthenticated requests will automatically be routed to `/login`.

## Available Endpoints

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/` | Live IPTV Player | Authenticated |
| `GET` | `/login` | Modern Login Page | Public |
| `POST` | `/login` | Authenticate & establish session | Public |
| `GET` | `/register` | Modern Register Page | Public |
| `POST` | `/register` | Register account with validation | Public |
| `POST` / `GET` | `/logout` | Destroy session & sign out | Authenticated |
