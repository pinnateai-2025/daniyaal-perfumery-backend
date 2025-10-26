const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/sequelize");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// test route
app.get("/", (req, res) => res.send("Daniyaal Perfumery Backend is running..."));

// DB connect test
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = app;
