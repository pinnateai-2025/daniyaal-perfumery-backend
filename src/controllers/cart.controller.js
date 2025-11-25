const {Cart, CartItem, Product} = require("../models");

// --------------------------------------- Add item to cart ------------------------------------------
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: Number(quantity)
      });
    }

    return res.status(201).json({
      message: "Item added to cart successfully",
      cartItem
    });

  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------- Get user's cart ------------------------------------------

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: err.message });
  }
};



// --------------------------------------- Update item quantity in cart ------------------------------------------
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ message: "Cart item updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------- Remove item from cart ------------------------------------------

exports.removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    await cartItem.destroy();
    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
