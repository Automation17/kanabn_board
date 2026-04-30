const mongoose = require('mongoose');

// Connects to MongoDB using the URI from .env
async function connectDB() {
  try {
    // Attempt to connect to the database using the URI defined in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit the process if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
