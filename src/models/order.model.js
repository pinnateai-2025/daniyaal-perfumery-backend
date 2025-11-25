const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId",
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "totalAmount",
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
      field: "payment_status",
    },

    order_status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
      field: "order_status",
    },

    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt",
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: "updatedAt",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;
