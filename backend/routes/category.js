const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");

router
  .route("/category")
  .get(getAllCategories)
  .post(
    validateToken,
    requireRoles(["Admin", "Store Operator"]),
    createCategory
  );
router
  .route("/category/:id")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getCategory)
  .put(validateToken, requireRoles(["Admin", "Store Operator"]), updateCategory)
  .delete(
    validateToken,
    requireRoles(["Admin", "Store Operator"]),
    deleteCategory
  );

module.exports = router;
