const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/sequelize");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => res.send("Daniyaal Perfumery Backend is running..."));

// DB connect test
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = app;
