const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");

router.route("/products").get(getAllProducts).post(createProduct);
router
  .route("/products/:id")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getProduct)
  .put(validateToken, requireRoles(["Admin", "Store Operator"]), updateProduct)
  .delete(deleteProduct);

module.exports = router;
