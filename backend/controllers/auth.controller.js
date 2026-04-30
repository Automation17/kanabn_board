const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// ===== Register =====
// POST /api/auth/register
// Creates a new user account and returns a JWT token
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // --- Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create User ---
    const user = await User.create({ name, email, password: hashedPassword });


    // ===== Helper: Generate JWT Token =====
    // Creates a signed token containing the user's ID
    // The token expires in 7 days — after that, the user must login again
    const token = jwt.sign(
      { id: user._id },           // Payload: data stored inside the token
      process.env.JWT_SECRET,   // Secret key from .env used to sign the token
      { expiresIn: '7d' }       // Token expiry duration
    );

    // --- Respond with user data + token ---
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token // JWT sent back to be stored on the client
    });

  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// ===== Login =====
// POST /api/auth/login
// Verifies email/password and returns a JWT token
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found → reject early (prevents crash on bcrypt.compare)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If password doesn't match → reject
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // --- Respond with user data + token ---
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
