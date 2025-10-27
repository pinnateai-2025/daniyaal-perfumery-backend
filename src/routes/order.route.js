const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');

// ✅ Create Order (protected)
router.post('/create', authenticate, orderController.createOrder);

// ✅ Verify Payment (protected)
router.post('/verify', authenticate, orderController.verifyPayment);

// ✅ Get User Orders (protected)
router.get('/user', authenticate, orderController.getUserOrders);

// ✅ Cancel Order (protected)
router.delete('/cancel/:orderId', authenticate, orderController.cancelOrder);

module.exports = router;