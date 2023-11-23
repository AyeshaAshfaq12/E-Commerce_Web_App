const Product = require("../models/products");
const fs = require("fs");
const Image = require("../models/images");
const path = require("path");
exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    const savedImages = [];

    // Loop through the array of files
    for (const file of req.files) {
      const newImage = new Image({
        name: req.body.name, // You might want to customize this based on your needs
        image: {
          data: fs.readFileSync(
            path.join(__dirname, "..", "public", "Images", file.filename)
          ),
          contentType: "image/png",
        },
      });

      const savedImage = await newImage.save();
      savedImages.push(savedImage._id);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $push: { images: { $each: savedImages } } },
      { new: true }
    );
    console.log(req.body);
    console.log("req.body SUbhan");

    res.json({
      message: "Images uploaded successfully",
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
