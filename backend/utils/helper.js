const bcrypt = require("bcrypt");

roles = ["user", "admin", "moderator"];

async function hashPassword(password) {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

async function comparePasswords(enteredPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  roles,
  comparePasswords,
  hashPassword,
};
