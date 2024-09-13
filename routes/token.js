const express = require('express');
const router = express.Router();

const tokenActionsController = require("../controllers/token_actions.controller");

router.post("/decode", tokenActionsController.decode_token);
router.post("/create_token", tokenActionsController.create_token);
router.post("/block_token", tokenActionsController.block_token);
router.post("/refresh_token", tokenActionsController.refresh_token);
router.post("/get_refresh_token", tokenActionsController.get_refresh_token);

module.exports = router;