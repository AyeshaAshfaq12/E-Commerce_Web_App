const Product = require("../models/products");
const slugify = require("slugify");
const logToDatabase = require("../controllers/logs"); // Import the log service
const { compareObjects } = require("../utils/compare");
const logger = require("../database/logger");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: { $ne: "Deleted" },
    }).populate({
      path: "Category",
      model: "Category", // replace with the actual model name for Category
    });

    res.status(200).json(products);
    // console.log(products);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.clear();
    // console.log(req.body);
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
    // console.log(product);
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
    const product = await Product.findById({ _id: id }).populate({
      path: "Category",
      model: "Category", // replace with the actual model name for Category
    });
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
    console.log(req.body);
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
    // logger.info({
    //   message: "This is an information log",
    //   userId: req.user.id, // shorthand for userId: userId
    //   // any other properties you want to include in this specific log entry
    // });
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

const getAllBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("details.brand");
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Internal Server Error" });
    logger.error(`Error: ${error}`);
  }
};

const getAllTags = async (req, res) => {
  try {
    console.log("yes Subhan");
    const tags = await Product.distinct("tags");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
    console.log("no Subhan");
    logger.error(`Error: ${error}`);
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;

    const { newStock } = req.body;
    const changedFields = {};

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    changedFields["stock"] = {
      oldValue: existingProduct.currentStock,
      newValue: (existingProduct.currentStock += newStock),
      status: "updated",
    };

    var dateTime = Date.now();
    existingProduct.inventoryHistory.push({
      stock: newStock,
      date: dateTime,
    });
    changedFields["inventoryHistory"] = {
      newValue: {
        stock: newStock,
        date: dateTime,
      },
      status: "new",
    };

    const updatedProduct = await existingProduct.save();

    // Log the stock update action
    await logToDatabase(
      "Update Stock",
      "product",
      updatedProduct._id,
      changedFields,
      req.user.id
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    logger.error(`Error: ${error}`);

    console.error(`Error updating stock: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const { newPrice, newDiscount } = req.body;
    const existingProduct = await Product.findById(id);
    const changedFields = {};

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const isPriceDiscountChanged =
      existingProduct.priceHistory.length === 0 ||
      existingProduct.priceHistory[0].price !== newPrice ||
      existingProduct.priceHistory[0].discount !== newDiscount;
    if (newPrice) {
      changedFields["price"] = {
        oldValue: existingProduct.priceHistory[0].price,
        newValue: newPrice,
        status: "updated",
      };
    }

    if (newDiscount) {
      changedFields["discount"] = {
        oldValue: existingProduct.priceHistory[0].discount,
        newValue: newDiscount,
        status: "updated",
      };
    }
    if ((newPrice || newDiscount) && isPriceDiscountChanged) {
      existingProduct.priceHistory.unshift({
        price: newPrice ?? existingProduct.priceHistory[0].price,
        discount: newDiscount ?? existingProduct.priceHistory[0].discount,
        date: Date.now(),
      });
      const updatedProduct = await existingProduct.save();
      await logToDatabase(
        "Update Price",
        "product",
        updatedProduct._id,
        changedFields,
        req.user.id
      );

      return res.status(200).json(updatedProduct);
    } else {
      return res.status(200).json(existingProduct);
    }
  } catch (error) {
    logger.error(`Error: ${error}`);

    console.error(`Error updating price: ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllBrands,
  getAllTags,
  updatePrice,
  updateStock,
};
