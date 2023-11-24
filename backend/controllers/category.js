const Category = require("../models/category");
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createCategory = async (req, res) => {
  try {
    console.log(req.body);
    const category = await Category.create(req.body);

    res.status(201).json(category);
    console.log(category);
  } catch (err) {
    logger.error(`Error: ${error}`);
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
