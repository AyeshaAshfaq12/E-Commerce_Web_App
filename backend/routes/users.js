const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUserById,
  loginUser,
  logoutUser,
} = require("../controllers/users.js");
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");
const {
  checkDuplicateUsernameOrEmail,
} = require("../middleware/verifySignUp.js");

router
  .route("/users")
  .post(validateToken, requireRoles(["Admin"]), createUser)
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getAllUsers);
router
  .route("/users/:id")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getUserById)
  .put(validateToken, requireRoles(["Admin"]), updateUser)
  .delete(validateToken, requireRoles(["Admin"]), deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
