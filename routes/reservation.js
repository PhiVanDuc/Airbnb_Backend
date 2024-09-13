const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");

router.get("/", reservationController.get_reservations);
router.post("/create_reservation", reservationController.create_reservation);
router.delete("/cancel_reservation", reservationController.cancel_reservation);
router.post("/check_in_reservation", reservationController.check_in_reservation);
router.post("/check_out_reservation", reservationController.check_out_reservation);

module.exports = router;