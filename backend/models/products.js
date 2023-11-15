const mongoose = require("mongoose");
const category = require("./category.js");

const productSchema = new mongoose.Schema(
  {
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "out of stock"],
      default: "active",
    },
    currentStock: {
      type: Number,
      required: true,
    },
    averageReview: {
      type: Number,
      default: 0,
    },
    priceHistory: [
      {
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    Category: {
      type: category,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    inventoryHistory: [
      {
        stock: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviews: [
      {
        customer: {
          type: String,
        },
        reviewText: {
          type: String,
        },
        rating: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
