const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const streamRoutes = require('./routes/stream');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    app.set('trust proxy', 1);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Next.js frontend
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'cric-turbo-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Healthcheck
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stream', streamRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: isProd ? 'Internal server error' : err.message
    });
});

const server = app.listen(PORT, () => {
    console.log(`============================================`);
    console.log(` Cric API (Express) running on port ${PORT}`);
    console.log(` Allowed Frontend Origin: ${CLIENT_URL}`);
    console.log(` Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(`============================================`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('HTTP API server terminated');
        process.exit(0);
    });
});
