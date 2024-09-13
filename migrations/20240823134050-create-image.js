'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      property_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "properties",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      public_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_cover: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      image_bedroom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      image_bathroom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('images');
  }
};