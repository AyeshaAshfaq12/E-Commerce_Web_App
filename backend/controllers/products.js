const Product = require("../models/products");
const slugify = require("slugify");
const logToDatabase = require("../controllers/logs"); // Import the log service
const { compareObjects } = require("../utils/compare");
const logger = require("../database/logger");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("Category");
    res.status(200).json(products);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.clear();
    console.log(req.body);
    let reqProduct = req.body;
    const slug = slugify(reqProduct.title, { lower: true });
    const uniqueSlug = `${slug}-${Date.now()}`;
    reqProduct["slug"] = uniqueSlug;

    const product = await Product.create(req.body);

    // Log the creation action
    await logToDatabase(
      "create",
      "Product",
      product._id,
      product.toObject(),
      req.user.id
    );

    res.status(201).json(product);
    console.log(product);
  } catch (error) {
    if (error.code === 11000) {
      const duplicatedKey = Object.keys(error.keyPattern)[0];
      const existingProduct = await Product.findOne({
        [duplicatedKey]: req.body[duplicatedKey],
      });
      return res.status(409).json(existingProduct);
    }
    logger.error(`Error: ${error}`);
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const originalProduct = await Product.findById(id);

    if (!originalProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Identify changed fields
    const changedFields = compareObjects(
      originalProduct.toObject(),
      req.body,
      Product.schema
    );

    // Update the product only if there are changes
    if (Object.keys(changedFields).length > 0) {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      // Log the update action with changed fields
      await logToDatabase(
        "update",
        "Product",
        updatedProduct._id,
        {
          changedFields,
        },
        req.user.id
      );

      res.status(200).json(updatedProduct);
      console.log(updatedProduct);
    } else {
      res.status(200).json(originalProduct);
      console.log(originalProduct);
    }
  } catch (err) {
    logger.info({
      message: "This is an information log",
      userId: req.user.id, // shorthand for userId: userId
      // any other properties you want to include in this specific log entry
    });
    logger.error(`Error: ${err}`, { userId: req.user.id });
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Log the delete action
    await logToDatabase(
      "delete",
      "Product",
      id,
      deletedProduct.toObject(),
      req.user.id
    );

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deletedProduct,
    });
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
