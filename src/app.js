const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/sequelize");
const adminRoutes = require("./routes/admin.route")
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);


// test route
app.get("/", (req, res) => res.send("Daniyaal Perfumery Backend is running..."));

// DB connect test
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// must be placed after all routes in app.js
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const message = err && err.message ? err.message : String(err);
  const status = err.status || 500;
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});


module.exports = app;
