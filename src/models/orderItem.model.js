const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "orderId"    // MUST match MySQL exactly
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "productId"  // MUST match MySQL exactly
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: "quantity"
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: "price"
  },

  createdAt: {
    type: DataTypes.DATE,
    field: "createdAt"
  },

  updatedAt: {
    type: DataTypes.DATE,
    field: "updatedAt"
  }
}, {
  tableName: "order_items",
  timestamps: true
});

module.exports = OrderItem;
