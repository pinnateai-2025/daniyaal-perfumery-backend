// src/controllers/payment.controller.js
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const { Order, OrderItem, CartItem, Cart, Product } = require("../models");

/**
 * Helper: safe fetch cart items (expects CartItem -> Product assoc with as: 'product')
 */
async function fetchCartItemsWithProducts(cartId) {
  return await CartItem.findAll({
    where: { cartId },
    include: [{ model: Product, as: "product" }]
  });
}

/* ----------------------
   1) CASH ON DELIVERY
   ---------------------- */
exports.cashOnDelivery = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    const cartItems = await fetchCartItemsWithProducts(cart.id);
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Cart empty" });

    // compute total
    const total = cartItems.reduce((sum, item) => {
      const price = item.product && item.product.price ? item.product.price : 0;
      return sum + (item.quantity || 0) * price;
    }, 0);

    console.log("COD: computed total =", total);

    // Create order matching your Order model attributes
    const order = await Order.create({
      userId,
      totalAmount: total,            // <-- matches your model: totalAmount
      payment_status: "pending",     // <-- matches your model field name
      order_status: "pending"
    });

    // persist order items (use fields that match your OrderItem model)
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId || (item.product && item.product.id),
        quantity: item.quantity,
        price: item.product ? item.product.price : 0
     });
   }

    // clear cart items
    await CartItem.destroy({ where: { cartId: cart.id } });

    return res.json({ success: true, message: "Order placed (COD)", orderId: order.id });
  } catch (error) {
    console.error("COD Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ----------------------
   2) RAZORPAY ORDER CREATE
   ---------------------- */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    const cartItems = await fetchCartItemsWithProducts(cart.id);
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Cart empty" });

    const total = cartItems.reduce((sum, item) => {
      const price = item.product && item.product.price ? item.product.price : 0;
      return sum + (item.quantity || 0) * price;
    }, 0);

    console.log("Razorpay create-order: total =", total);

    const options = {
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.json({
      success: true,
      razorpayOrder,
      amount: total
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ----------------------
   3) RAZORPAY VERIFY
   ---------------------- */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    // verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // fetch cart items again and compute total
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    const cartItems = await fetchCartItemsWithProducts(cart.id);
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Cart empty" });

    const total = cartItems.reduce((sum, item) => {
      const price = item.product && item.product.price ? item.product.price : 0;
      return sum + (item.quantity || 0) * price;
    }, 0);

    console.log("verifyPayment: computed total =", total);

    // Create order using the exact attribute names from your Order model
    const order = await Order.create({
      userId,
      totalAmount: total,           // <-- matches your model
      payment_status: "paid",
      order_status: "paid"
      // optionally store other payment fields if your model has them (e.g. payment_id)
    });

    // create order items
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId || (item.product && item.product.id),
        quantity: item.quantity,
        price: item.product ? item.product.price : 0
      });
    }

    // clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    return res.json({ success: true, message: "Payment verified, order completed", orderId: order.id });
  } catch (error) {
    console.error("Verify Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
