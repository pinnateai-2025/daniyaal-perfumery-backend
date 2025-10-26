const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fragranceNotes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
}, {
  tableName: "products",
  timestamps: true
});

module.exports = Product;
