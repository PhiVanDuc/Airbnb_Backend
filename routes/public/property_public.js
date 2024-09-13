const express = require("express");
const router = express.Router();

const propertyPublicController = require("../../controllers/public/property_public.controller");

router.get("/find_properties_public/:category_id/:page/:limit", propertyPublicController.find_properties_public);
router.get("/get_property_public/:id", propertyPublicController.get_property_public);

module.exports = router;