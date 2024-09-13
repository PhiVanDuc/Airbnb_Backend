const express = require('express');
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/", userController.get_users);
router.post("/profile", userController.profile);
router.post("/assign_roles", userController.assign_roles);

module.exports = router;