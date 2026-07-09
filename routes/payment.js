const express = require("express");

const router = express.Router();

const {
    createOrder,
    verifyPayment,
    webhook
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPayment);

router.post("/webhook", webhook);

module.exports = router;