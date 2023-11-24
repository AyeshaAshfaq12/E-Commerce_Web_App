const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  timestamp: Date,
  timestamp: Date,
  user: String,
});

// Create a Mongoose model
const LogModel = mongoose.model("Logs", logSchema);

module.exports = LogModel;
