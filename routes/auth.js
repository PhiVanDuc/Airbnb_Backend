const express = require('express');
const router = express.Router();

const registerController = require("../controllers/register.controller");
const loginController = require("../controllers/login.controller");
const forgotPasswordController = require("../controllers/forgot_password.controller");

router.post("/register/add_verification_token", registerController.add_verification_token);
router.post("/register/add_account", registerController.add_account);

router.post("/login", loginController.login);
router.post("/oauth", loginController.oauth);
router.post("/logout", loginController.logout);
router.post("/verify_black_list", loginController.verify_black_list);

router.post("/forgot_password/change_password", forgotPasswordController.change_password);

module.exports = router;