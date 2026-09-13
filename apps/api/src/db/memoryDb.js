const bcrypt = require('bcryptjs');

class InMemoryDatabase {
    constructor() {
        this.users = new Map();
        this.emailIndex = new Map();
        this.usernameIndex = new Map();
        this._currentId = 1;
        this._initDemoUser();
    }

    async _initDemoUser() {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        await this.createUser({
            username: 'demo_user',
            email: 'demo@example.com',
            password: hashedPassword,
            isPreHashed: true
        });
    }

    async createUser({ username, email, password, isPreHashed = false }) {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();

        if (this.emailIndex.has(normalizedEmail)) {
            const error = new Error('Email is already registered.');
            error.statusCode = 409;
            throw error;
        }

        if (this.usernameIndex.has(normalizedUsername)) {
            const error = new Error('Username is already taken.');
            error.statusCode = 409;
            throw error;
        }

        let passwordHash = password;
        if (!isPreHashed) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const id = String(this._currentId++);
        const now = new Date();
        const user = {
            id,
            username: username.trim(),
            email: normalizedEmail,
            passwordHash,
            createdAt: now,
            updatedAt: now
        };

        this.users.set(id, user);
        this.emailIndex.set(normalizedEmail, id);
        this.usernameIndex.set(normalizedUsername, id);

        return this._sanitizeUser(user);
    }

    async findByEmail(email) {
        if (!email) return null;
        const normalized = email.trim().toLowerCase();
        const id = this.emailIndex.get(normalized);
        if (!id) return null;
        return this.users.get(id) || null;
    }

    async findByUsername(username) {
        if (!username) return null;
        const normalized = username.trim().toLowerCase();
        const id = this.usernameIndex.get(normalized);
        if (!id) return null;
        return this.users.get(id) || null;
    }

    async findById(id) {
        if (!id) return null;
        const user = this.users.get(String(id));
        if (!user) return null;
        return this._sanitizeUser(user);
    }

    async verifyPassword(user, plainPassword) {
        if (!user || !user.passwordHash) return false;
        return bcrypt.compare(plainPassword, user.passwordHash);
    }

    _sanitizeUser(user) {
        if (!user) return null;
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}

module.exports = new InMemoryDatabase();
