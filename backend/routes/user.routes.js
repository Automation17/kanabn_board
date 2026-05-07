const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/user.controller.js');

// ===== User Routes =====

// GET /api/users → Get all users
router.get('/', getAllUsers);

module.exports = router;