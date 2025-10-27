const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middleware/auth.middleware");

// ✅ Add item to cart (protected)
router.post("/add", authenticate, cartController.addItemToCart);

// ✅ Get user's cart (protected)
router.get("/", authenticate, cartController.getCart);

// ✅ Update item quantity in cart (protected)
router.put("/update/:itemId", authenticate, cartController.updateCartItem);

// ✅ Remove item from cart (protected)
router.delete("/remove/:itemId", authenticate, cartController.removeItemFromCart);

module.exports = router;