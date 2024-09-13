const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");

router.get("/get_conversation", chatController.get_conversation);
router.post("/create_conversation", chatController.create_conversation);
router.post("/create_message", chatController.create_message);
router.get("/get_conversations", chatController.get_conversations);
router.post("/mark_read_messages", chatController.mark_read_messages);

module.exports = router;