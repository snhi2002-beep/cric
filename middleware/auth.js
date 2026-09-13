/**
 * Authentication Middleware
 */

// Protects routes that require an authenticated session
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'Please log in to access the live player.');
    res.redirect('/login');
};

// Redirects already authenticated users away from guest-only routes
const redirectIfAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    requireAuth,
    redirectIfAuth
};
