const express = require("express");
const router = express.Router();

const stripeController = require("../controllers/stripe.controller");

router.post("/create_payment_intent", stripeController.create_payment_intent);
router.get("/get_payment_detail/:client_secret", stripeController.get_payment_detail);

module.exports = router;