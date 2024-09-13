'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      structure: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "categories",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      privacy_type: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      people_count: {
        type: Sequelize.INTEGER
      },
      bedroom_count: {
        type: Sequelize.INTEGER
      },
      beds_count: {
        type: Sequelize.INTEGER
      },
      bathroom_count: {
        type: Sequelize.INTEGER
      },
      property_count: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      base_price: {
        type: Sequelize.FLOAT
      },
      profit_price: {
        type: Sequelize.FLOAT
      },
      create_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('properties');
  }
};