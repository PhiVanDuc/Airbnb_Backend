const express = require("express");
const router = express.Router();

const categoryPublicController = require("../../controllers/public/category_public.controller");

router.get("/get_categories_public", categoryPublicController.get_categories_public);

module.exports = router;