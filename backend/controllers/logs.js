const LogModel = require("../models/logs");
const logger = require("../database/logger");
const logToDatabase = async (action, objectType, objectId, details, user) => {
  const logEntry = new LogModel({
    action,
    objectType,
    objectId,
    details,
    user,
    timestamp: new Date(),
  });

  try {
    await logEntry.save();
    logger.info(
      `Audit log saved for ${action} on ${objectType} with ID ${objectId}`
    );
  } catch (error) {
    logger.error(`Error saving audit log: ${error.message}`);
  }
};
module.exports = logToDatabase;
