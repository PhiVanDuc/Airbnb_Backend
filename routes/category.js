const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");

router.post("/", categoryController.get_categories);
router.get("/detail_category", categoryController.detail_category);
router.post("/edit", categoryController.edit_category);
router.post("/add", categoryController.add_category);
router.post("/delete", categoryController.delete_category);

module.exports = router;