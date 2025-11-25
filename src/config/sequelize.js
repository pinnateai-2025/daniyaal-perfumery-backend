const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => {
      if (msg.startsWith("Executing (default): SELECT 1+1")) return;
      if (msg.includes("ERROR")) console.error(msg);
    },
    define: {
      underscored: false
    }
  }
);

module.exports = sequelize;
