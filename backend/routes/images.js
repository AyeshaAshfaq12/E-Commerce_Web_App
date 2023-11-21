const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage, getImagesByProductId } = require("../controllers/images");
const storage = require("../middleware/file-storage");
const upload = multer({ storage });

router.post("/upload/:id", upload.single("image"), uploadImage);
router.get("/get/:id", getImagesByProductId);

module.exports = router;
