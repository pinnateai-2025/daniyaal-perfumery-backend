const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middleware/auth.middleware");

//user's protected
router.post("/add", authenticate, cartController.addItemToCart);
router.get("/", authenticate, cartController.getCart);
router.put("/update/:itemId", authenticate, cartController.updateCartItem);
router.delete("/remove/:itemId", authenticate, cartController.removeItemFromCart);

module.exports = router;