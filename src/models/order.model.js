const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_status: { 
    type: DataTypes.ENUM("pending","paid","failed"), 
    defaultValue: "pending" 
},
  order_status: { 
    type: DataTypes.ENUM("pending","processing","shipped","delivered"), 
    defaultValue: "pending" 
}
}, {
  tableName: "orders",
  timestamps: true,
});

module.exports = Order;
