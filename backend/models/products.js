const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: String,
  lastName: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  pic: {
    type: String,
    // default:
    //   "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  comment: String,
  commentedAt: {
    type: Date,
    default: Date.now,
  },
});
const discountSchema = new mongoose.Schema(
  {
    name: String,
    details: String,
    percentage: { type: Number, min: 0, max: 100 },
    isActive: Boolean,
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discounts: [discountSchema],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unitCount: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    totalReviews: {
      type: Number,
      default: 0,
    },
    inventory: {
      inStock: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
