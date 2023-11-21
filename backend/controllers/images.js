const Product = require("../models/products");
const fs = require("fs");
const Image = require("../models/images");
const path = require("path");
exports.uploadImage = async (req, res) => {
  console.log("product_id");

  try {
    const { id } = req.params;
    console.log(id);
    console.log("I am product_id");
    const newImage = new Image({
      name: req.body.name,
      image: {
        data: fs.readFileSync(
          path.join(__dirname, "..", "public", "Images", req.file.filename)
        ),
        contentType: "image/png",
      }, //different
    });

    const savedImage = await newImage.save();
    console.log(savedImage);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $push: { images: savedImage._id } },
      { new: true }
    );

    res.json({
      message: "Image uploaded successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getImagesByProductId = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("images");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(product.images);

    res.json(product.images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
