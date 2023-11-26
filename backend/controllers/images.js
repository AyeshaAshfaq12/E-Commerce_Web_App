const Product = require("../models/products");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const Image = require("../models/images");
const mime = require("mime-types");
const path = require("path");
const mongoose = require("mongoose");
// exports.uploadImages = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(req.body);

//     const savedImages = [];

//     // Loop through the array of files
//     for (const file of req.files) {
//       const newImage = new Image({
//         name: file.filename, // You might want to customize this based on your needs
//         image: {
//           data: fs.readFileSync(
//             path.join(__dirname, "..", "public", "Images", file.filename)
//           ),
//           contentType:
//             mime.lookup(file.originalname) || "application/octet-stream",
//         },
//       });

//       const savedImage = await newImage.save();
//       savedImages.push(savedImage._id);
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $push: { images: { $each: savedImages } } },
//       { new: true }
//     );
//     // console.log(req.body);
//     // console.log("req.body SUbhan");

//     res.json({
//       message: "Images uploaded successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.uploadImages = async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          images: { $each: urls.map((file) => file) },
        },
      },
      {
        new: true,
      }
    );

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};

// exports.deleteImages = async (req, res) => {
//   try {
//     const { imageIds } = req.body;
//     const result = await Image.deleteMany({ _id: { $in: imageIds } });

//     res.json({
//       message: `Deleted ${result.deletedCount} images successfully`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.deleteImages = (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  const deletionPromises = images.map((image) => {
    // Delete image from Cloudinary
    return cloudinaryDeleteImg(image.public_id, "images").then(() =>
      // Remove the image from the Product model
      Product.findByIdAndUpdate(
        { _id: id },
        { $pull: { images: { _id: image._id } } }
      )
    );
  });

  // Wait for all deletion promises to resolve
  Promise.all(deletionPromises)
    .then(() => {
      res.json({ message: "Images deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.convertImage = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body);

    const savedImages = [];

    // Loop through the array of files
    for (const file of req.files) {
      const newImage = new Image({
        name: file.filename, // You might want to customize this based on your needs
        image: {
          data: fs.readFileSync(
            path.join(__dirname, "..", "public", "Images", file.filename)
          ),
          contentType:
            mime.lookup(file.originalname) || "application/octet-stream",
        },
      });
      console.log(newImage.image.data);
      console.log("Subhan");
      res.json({
        data: newImage.image.data,
      });
    }
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
