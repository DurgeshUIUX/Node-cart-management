const mongoose = require("mongoose");

const dataConnectionMongo = async (callback) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    if (callback) callback(); // Call the callback after successful connection
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn("MongoDB disconnected. Attempting to reconnect...");
  // Optionally, you can add logic to retry the connection
});

module.exports = { dataConnectionMongo };
