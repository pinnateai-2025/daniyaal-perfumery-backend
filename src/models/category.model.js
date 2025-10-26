const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
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
}, {
    tableName: 'categories',
    timestamps: true
  }
);

module.exports = Category;
