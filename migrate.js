const sequelize = require("./src/config/sequelize");
const User = require("./src/models/user.model");
const Product = require("./src/models/product.model");
const Category = require("./src/models/category.model");
const cart = require("./src/models/cart.model");
const CartItem = require("./src/models/cartItem.model");
const Order = require("./src/models/order.model");
const OrderItem = require("./src/models/orderItem.model");


(async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } to reset tables
    console.log("✅ Database synced successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ DB sync error:", err);
    process.exit(1);
  }
})();