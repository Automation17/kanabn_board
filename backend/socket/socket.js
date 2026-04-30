const socketIO = require("socket.io");

function initSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // Your Vite frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for task updates from any client
    socket.on("taskUpdated", (task) => {
      socket.broadcast.emit("taskUpdated", task); // broadcast to all other clients
    });

    socket.on("taskCreated", (task) => {
      socket.broadcast.emit("taskCreated", task);
    });

    socket.on("taskDeleted", (taskId) => {
      socket.broadcast.emit("taskDeleted", taskId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;