const sequelize = require("./src/config/sequelize");
const User = require("./src/models/user.model");
const Product = require("./src/models/product.model");

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