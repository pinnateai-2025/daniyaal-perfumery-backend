const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");

const Order = sequelize.define("Order", {
  // id: {
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   primaryKey: true,
  // },

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.ENUM("pending","processing","shipped","delivered","cancelled"), 
    defaultValue: "pending" 
}
}, {
  tableName: "orders",
  timestamps: true,
});

module.exports = Order;
