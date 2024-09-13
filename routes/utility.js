const express = require('express');
const router = express.Router();

const utilityController = require("../controllers/utility.controller");

router.post("/", utilityController.get_utilities);
router.get("/detail_utility", utilityController.detail_utility);
router.post("/add", utilityController.add_utility);
router.post("/edit", utilityController.edit_category);
router.post("/delete", utilityController.delete_category);

module.exports = router;