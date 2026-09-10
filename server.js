const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "USDT Exchange API is running", 
    db: "MongoDB Atlas" 
  });
});

// Example: Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.log("MongoDB Connection Error:", err);
});
