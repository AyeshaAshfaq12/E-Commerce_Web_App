const mongoose = require("mongoose");
const logger = require("../database/logger");

const LogSchema = new mongoose.Schema({
  action: String,
  objectType: String,
  objectId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  user: String,
  timestamp: Date,
});

const LogModel = mongoose.model("Audit Logs", LogSchema);

module.exports = LogModel;
