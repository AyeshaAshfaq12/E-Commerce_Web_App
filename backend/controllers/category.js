const Category = require("../models/category");
const mongoose = require("mongoose");
const logger = require("../database/logger");
const logToDatabase = require("../controllers/logs"); // Import the log service

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};
const createCategory = async (req, res) => {
  try {
    const { name, parentCategory, subcategories } = req.body;

    // Check if 'name' is present and is a non-empty string
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Invalid or missing name property" });
    }

    // Create the category with only the 'name' property
    const categoryData = { name };

    // Add 'parentCategory' and 'subcategories' if they exist and are valid
    if (parentCategory) {
      // Check if 'parentCategory' is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(parentCategory)) {
        categoryData.parentCategory = parentCategory;
      }
    }

    if (subcategories) {
      // Check if 'subcategories' is an array of valid ObjectIds
      if (
        Array.isArray(subcategories) &&
        subcategories.every(mongoose.Types.ObjectId.isValid)
      ) {
        categoryData.subcategories = subcategories;
      }
    }

    // Create the category with the prepared data
    const category = await Category.create(categoryData);
    // Log the creation action
    await logToDatabase(
      "create",
      "Category",
      category._id,
      category.toObject(),
      req.user.id
    );

    res.status(201).json(category);
    console.log(category);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById({ _id: id });
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(`Error: ${err}`);
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedcategory = await Category.findByIdAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedcategory);
    console.log(updatedcategory);
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedcategory = await Category.findByIdAndDelete(id);

    if (!deletedcategory) {
      return res.status(404).json({ error: "category not found" });
    }

    res.status(200).json({
      message: "category deleted successfully",
      deletedcategory: deletedcategory,
    });
  } catch (err) {
    logger.error(`Error: ${err}`);

    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
