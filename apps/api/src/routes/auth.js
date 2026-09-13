const express = require('express');
const router = express.Router();
const db = require('../db/memoryDb');

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { loginIdentifier, password } = req.body;

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Both username/email and password are required.'
            });
        }

        const trimmed = loginIdentifier.trim();
        let user = await db.findByEmail(trimmed);
        if (!user) {
            user = await db.findByUsername(trimmed);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password.'
            });
        }

        const isMatch = await db.verifyPassword(user, password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password.'
            });
        }

        req.session.regenerate((err) => {
            if (err) return next(err);

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            req.session.save((saveErr) => {
                if (saveErr) return next(saveErr);
                res.json({
                    success: true,
                    user: req.session.user,
                    message: 'Signed in successfully'
                });
            });
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 25) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 25 characters.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match.'
            });
        }

        const existingEmail = await db.findByEmail(trimmedEmail);
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        const existingUsername = await db.findByUsername(trimmedUsername);
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'This username is already taken.'
            });
        }

        const newUser = await db.createUser({
            username: trimmedUsername,
            email: trimmedEmail,
            password
        });

        res.status(201).json({
            success: true,
            user: newUser,
            message: 'Account created successfully'
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({
            success: true,
            user: req.session.user
        });
    }
    res.status(401).json({
        success: false,
        message: 'No active session'
    });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Logout failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } else {
        res.json({ success: true, message: 'Already logged out' });
    }
});

module.exports = router;
