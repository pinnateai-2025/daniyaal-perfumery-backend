const Razorpay = require('razorpay');
const crypto = require('crypto');

const { Order, OrderItem, Cart, CartItem, Product } = require('../models');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --------------------------------------- Create Order ------------------------------------------

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_mode } = req.body;

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        { 
        model: CartItem,
        as: 'cartItems', 
        include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!cart || !cart.cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cart.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let razorpayOrder = null;
    if (payment_mode === 'online') {
      razorpayOrder = await razorpay.orders.create({
        amount: total * 100,
        currency: 'INR',
      });
    }

    const order = await Order.create({
      userId,
      totalAmount: total,
      payment_mode,
      payment_status: payment_mode === 'cod' ? 'pending' : 'pending',
      razorpay_order_id: razorpayOrder ? razorpayOrder.id : null
    });

    for (const item of cart.cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({ message: 'Order created', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------- Verify Payment ------------------------------------------

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await Order.update(
        { payment_status: 'paid', razorpay_payment_id },
        { where: { razorpay_order_id } }
      );
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------- Get User Orders ------------------------------------------

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------- Cancel Order ------------------------------------------

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.order_status = 'cancelled';
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};