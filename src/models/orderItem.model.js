const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const orderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
   price: { 
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: true
});

module.exports = orderItem;
