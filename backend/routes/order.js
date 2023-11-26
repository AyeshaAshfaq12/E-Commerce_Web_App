const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const {
  createOrderByUserId,
  getOrderByOrderId,
  getOrdersByUserId,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");

// Get Order by Order ID
router.get("/order/:orderId", getOrderByOrderId);

// Get Orders by User ID
router.get("/orders/user/:userId", getOrdersByUserId);

// Get All Orders (with filter options based on status)
router.get("/orders", getAllOrders);

// Update Order (only change status)
router.put("/order/:orderId/update", updateOrder);

// Delete Order
router.delete("/order/:orderId/delete", deleteOrder);

// Create Order by User ID
router.post("/orders/user/:userId/create", createOrderByUserId);

module.exports = router;
