const mongoose = require("mongoose");

// OrderItem schema
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    items: [orderItemSchema],
    orderDate: { type: Date, default: Date.now },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    total: Number,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
