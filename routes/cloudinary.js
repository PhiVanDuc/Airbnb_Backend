const express = require("express");
const router = express.Router();

const cloudinaryController = require("../controllers/cloudinary.controller");

router.delete("/delete_image", cloudinaryController.delete_image);

module.exports = router;