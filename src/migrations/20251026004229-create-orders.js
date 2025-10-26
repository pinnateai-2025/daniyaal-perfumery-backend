'use strict';

const { or } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: "pending",
      },
      order_status: {
        type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered'),
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};
