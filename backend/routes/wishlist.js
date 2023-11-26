const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist");
const {
  getWishlist,
  addToWishlist,
  deleteFromWishlist,
} = require("../controllers/wishlist");
router.get("/wishlist/:userId", getWishlist);

// Add Product to Wishlist
router.post("/wishlist/:userId/add/:productId", addToWishlist);

// Remove Product from Wishlist
router.delete("/wishlist/:userId/remove/:productId", deleteFromWishlist);

module.exports = router;
