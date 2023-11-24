const winston = require("winston");
const jwt = require("jsonwebtoken");
const injectUserId = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.decode(token);
  const userId = decodedToken.id;

  winston.defaultMeta = { userId: userId };

  next();
};

module.exports = injectUserId;
