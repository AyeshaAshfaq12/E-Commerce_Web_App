const mongoose = require("mongoose");
const category = require("../models/images");
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
      enum: ["Active", "In Active", "Out of Stock"],
      default: "Active",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    // images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
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
productSchema.index({ SKU: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
