// Security Utilities
async function generateSalt() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Auth Logic
const AUTH_KEY = 'labubu_users';
const SESSION_KEY = 'labubu_session';

function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || {};
}

function saveUser(username, userData) {
    const users = getUsers();
    users[username] = userData;
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

async function initAdmin() {
    const users = getUsers();
    if (!users['admin']) {
        const salt = await generateSalt();
        const hash = await hashPassword('password123', salt);
        saveUser('admin', {
            hash: hash,
            salt: salt,
            role: 'admin'
        });
        console.log('Admin account initialized');
    }
}

async function login(username, password) {
    const users = getUsers();
    const user = users[username];
    
    if (!user) {
        throw new Error('Invalid username or password');
    }

    const hash = await hashPassword(password, user.salt);
    
    if (hash === user.hash) {
        const sessionData = {
            username: username,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return sessionData;
    } else {
        throw new Error('Invalid username or password');
    }
}

async function register(username, password) {
    const users = getUsers();
    if (users[username]) {
        throw new Error('Username already exists');
    }

    // Strict password validation
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    const salt = await generateSalt();
    const hash = await hashPassword(password, salt);
    
    saveUser(username, {
        hash: hash,
        salt: salt,
        role: 'user'
    });
    
    return true;
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

function checkAuth() {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (!session) {
        // Redirect to login if not on login or signup page
        const path = window.location.pathname;
        if (!path.endsWith('login.html') && !path.endsWith('signup.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return JSON.parse(session);
}

function getCurrentUser() {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Initialize admin on load
initAdmin();
