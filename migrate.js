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
  //   console.log("🧹 Dropping all tables...");
  //   await sequelize.drop(); // drops all tables

  //   console.log("🔄 Recreating tables...");
  //   await sequelize.sync({ force: true }); // recreates them

  //   console.log("✅ Database reset and synced successfully!");
  //   process.exit();
  // } catch (err) {
  //   console.error("❌ DB reset error:", err);
  //   process.exit(1);

  console.log("🔄 Syncing database (non-destructive)...");
    await sequelize.sync({ alter: true }); // updates tables without dropping data

    console.log("✅ Tables updated successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ DB sync error:", err);
    process.exit(1);
  }
  
})();