const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(404).json({ message: "No token provided" });
  }
};

function requireRoles(roles) {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;
      console.log(`User Role: ${userRole}`);

      if (roles.includes(userRole)) {
        console.log(`Role is included`);
        next();
      } else {
        res.status(403).json({ message: "Permission denied" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = {
  validateToken,
  requireRoles,
};
