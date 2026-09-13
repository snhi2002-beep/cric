const express = require('express');
const router = express.Router();
const db = require('../db/memoryDb');
const { redirectIfAuth } = require('../middleware/auth');

// GET /login - Show login page
router.get('/login', redirectIfAuth, (req, res) => {
    res.render('login', {
        title: 'Sign In | Cric IPTV',
        error: req.flash('error'),
        success: req.flash('success')
    });
});

// POST /login - Authenticate user & establish session
router.post('/login', redirectIfAuth, async (req, res, next) => {
    try {
        const { loginIdentifier, password } = req.body;

        if (!loginIdentifier || !password) {
            req.flash('error', 'Please provide both username/email and password.');
            return res.status(400).redirect('/login');
        }

        const trimmedIdentifier = loginIdentifier.trim();
        // Support login by either email or username
        let user = await db.findByEmail(trimmedIdentifier);
        if (!user) {
            user = await db.findByUsername(trimmedIdentifier);
        }

        if (!user) {
            req.flash('error', 'Invalid credentials. Please verify your details.');
            return res.status(401).redirect('/login');
        }

        const isMatch = await db.verifyPassword(user, password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials. Please verify your details.');
            return res.status(401).redirect('/login');
        }

        // Regenerate session to prevent session fixation attacks
        req.session.regenerate((err) => {
            if (err) return next(err);

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            req.session.save((saveErr) => {
                if (saveErr) return next(saveErr);
                res.redirect('/');
            });
        });
    } catch (err) {
        next(err);
    }
});

// GET /register - Show registration page
router.get('/register', redirectIfAuth, (req, res) => {
    res.render('register', {
        title: 'Create Account | Cric IPTV',
        error: req.flash('error'),
        success: req.flash('success')
    });
});

// POST /register - Register new user
router.post('/register', redirectIfAuth, async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required.');
            return res.status(400).redirect('/register');
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 25) {
            req.flash('error', 'Username must be between 3 and 25 characters.');
            return res.status(400).redirect('/register');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            req.flash('error', 'Please enter a valid email address.');
            return res.status(400).redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long.');
            return res.status(400).redirect('/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.status(400).redirect('/register');
        }

        const existingEmail = await db.findByEmail(trimmedEmail);
        if (existingEmail) {
            req.flash('error', 'An account with this email already exists.');
            return res.status(409).redirect('/register');
        }

        const existingUsername = await db.findByUsername(trimmedUsername);
        if (existingUsername) {
            req.flash('error', 'This username is already taken. Please choose another.');
            return res.status(409).redirect('/register');
        }

        await db.createUser({
            username: trimmedUsername,
            email: trimmedEmail,
            password
        });

        req.flash('success', 'Account created successfully! Please sign in.');
        res.redirect('/login');
    } catch (err) {
        next(err);
    }
});

// POST & GET /logout - Destroy session
const handleLogout = (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};

router.post('/logout', handleLogout);
router.get('/logout', handleLogout);

module.exports = router;
