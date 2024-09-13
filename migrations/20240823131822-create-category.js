'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: null,
        unique: true
      },
      category_type: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      prefix_icon: {
        type: Sequelize.STRING,
        allowNull: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};