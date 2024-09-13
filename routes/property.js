const express = require('express');
const router = express.Router();

const propertyController = require("../controllers/property.controller");

router.post("/get_properties", propertyController.get_properties);
router.post("/get_property", propertyController.get_property);
router.post("/get_property_step", propertyController.get_property_step);
router.post("/create_property", propertyController.create_property);
router.post("/update_property", propertyController.update_property);
router.delete("/delete_property/:id", propertyController.delete_property);

router.post("/add_image", propertyController.add_image);
router.post("/edit_image", propertyController.edit_image);

module.exports = router;