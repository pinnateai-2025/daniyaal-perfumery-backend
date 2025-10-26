'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cartId: { 
        type: Sequelize.UUID, 
        allowNull: false 
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false 
      },
      quantity: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 
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
    await queryInterface.dropTable('cart_items');
  }
};
