const router = require("express").Router();
const payment = require("../controllers/payment.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/cod", authenticate, payment.cashOnDelivery);
router.post("/create-order", authenticate, payment.createRazorpayOrder);
router.post("/verify", authenticate, payment.verifyPayment);
module.exports = router;
