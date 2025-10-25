const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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

  category: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  size: {
    type: DataTypes.STRING,
    allowNull: false,
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
