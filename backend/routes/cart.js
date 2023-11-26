const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

router.get("/cart/:id", cartController.getCart);

router.post("/cart/:id", cartController.addToCart);

// Remove Product from Cart
router.delete("/cart/:id", cartController.deleteFromCart);

module.exports = router;
