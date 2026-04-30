const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// ===== Auth Routes =====

// POST /api/auth/register → Create a new user account
router.post('/register', registerUser);

// POST /api/auth/login → Login and receive a JWT token
router.post('/login', loginUser);

module.exports = router;
