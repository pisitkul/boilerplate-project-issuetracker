const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

console.log("Connecting to MongoDB at:", url);

mongoose.connect(url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ Connected to MongoDB successfully");
});

db.on("error", (err) => {
  console.error("❌ Error connecting to MongoDB:", err);
});

db.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

module.exports = db;
