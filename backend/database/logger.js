const winston = require("winston");
const { createLogger, transports, format } = winston;

const LogModel = require("../models/error-logs");

class MongoDBTransport extends winston.Transport {
  async log(info, callback) {
    try {
      // Create a new log entry in the database
      const logEntry = new LogModel({
        level: info.level,
        message: info.message,
        timestamp: info.timestamp,
      });

      await logEntry.save(); // Use async/await instead of a callback

      // Continue processing the log entry for other transports
      callback(null, true);
    } catch (error) {
      console.error("Error saving log to MongoDB:", error);

      // Continue processing the log entry for other transports even if there's an error
      callback(null, false);
    }
  }
}

// ...

// Create a logger with both file and MongoDB transports
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new MongoDBTransport(),
  ],
});

module.exports = logger;
