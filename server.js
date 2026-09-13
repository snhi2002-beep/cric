const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'cric-super-secret-production-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Flash messages middleware
app.use(flash());

// Global locals middleware (user & flash messages available across all views)
app.use((req, res, next) => {
    res.locals.currentUser = req.session ? req.session.user : null;
    res.locals.flashError = req.flash('error');
    res.locals.flashSuccess = req.flash('success');
    next();
});

// Mount Routes
app.use('/', authRoutes);
app.use('/', playerRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page Not Found | Cric IPTV'
    });
});

// Production error-handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render('error', {
        title: 'Server Error | Cric IPTV',
        message: isProd ? 'An unexpected error occurred on the server.' : err.message,
        statusCode
    });
});

const server = app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(` Cric IPTV Streaming Server Active`);
    console.log(` Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(` URL:  http://localhost:${PORT}`);
    console.log(`===========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
