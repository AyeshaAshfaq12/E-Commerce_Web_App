const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllBrands,
  getAllTags,
  updatePrice,
  updateStock,
} = require("../controllers/products");
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");

router
  .route("/products")
  .get(validateToken, getAllProducts)
  .post(
    validateToken,
    requireRoles(["Admin", "Store Operator"]),
    createProduct
  );
router.route("/products/brands").get(getAllBrands);
router
  .route("/products/tags")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getAllTags);
router
  .route("/products/:id")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getProduct)
  .put(validateToken, requireRoles(["Admin", "Store Operator"]), updateProduct)
  .delete(
    validateToken,
    requireRoles(["Admin", "Store Operator"]),
    deleteProduct
  );
router
  .route("/products/updateStock/:id")
  .put(validateToken, requireRoles(["Admin", "Store Operator"]), updateStock);
router
  .route("/products/UpdatePrice/:id")
  .put(validateToken, requireRoles(["Admin", "Store Operator"]), updatePrice);

module.exports = router;
