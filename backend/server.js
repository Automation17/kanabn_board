const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Socket.io initialization
const initSocket = require("./socket/socket");

// ===== Import Routes =====
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.router');

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create an HTTP server (required later for Socket.io)
const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// ===== Middleware =====
// Allow React (running on a different port) to communicate with the server
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ===== Routes =====
// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Kanban API is running...' });
});

// Auth routes → /api/auth/register and /api/auth/login
app.use('/api/auth', authRoutes);

// Task routes → /api/tasks
app.use('/api/tasks', taskRoutes);

// ===== Start the Server =====

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${process.env.BACKEND_URL}:${PORT}`);
});
