const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImages, deleteImages } = require("../controllers/images");
const {
  uploadPhoto,
  productImgResize,
  blogImgResize,
} = require("../middleware/file-storage");
// const upload = multer({ storage });
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");

router.post(
  "/upload/:id",
  validateToken,
  requireRoles(["Admin", "Store Operator"]),
  uploadPhoto.array("images"),
  productImgResize,
  uploadImages
);
// router.post(
//   "/post",
//   validateToken,
//   requireRoles(["Admin", "Store Operator"]),
//   upload.array("files"),
//   convertImage
// );
router.post(
  "/deleteMany/:id",
  validateToken,
  requireRoles(["Admin", "Store Operator"]),
  deleteImages
);

// router.post("/upload/:id", upload.single("image"), uploadImage);
// router.get("/get/:id", getImagesByProductId);

module.exports = router;
