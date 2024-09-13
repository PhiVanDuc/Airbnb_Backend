'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      host_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL"
      },
      host_fullname: {
        type: Sequelize.STRING
      },
      host_image: {
        type: Sequelize.TEXT
      },
      host_email: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL"
      },
      customer_fullname: {
        type: Sequelize.STRING
      },
      customer_image: {
        type: Sequelize.TEXT
      },
      customer_email: {
        type: Sequelize.STRING
      },
      customer_number: {
        type: Sequelize.STRING
      },
      property_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "properties",
          key: "id",
        },
        onDelete: "SET NULL"
      },
      cover_image: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      categories: {
        type: Sequelize.STRING
      },
      check_in: {
        type: Sequelize.DATEONLY
      },
      check_out: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Upcoming'
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
    // Drop the reservations table
    await queryInterface.dropTable('reservations');
  }
};
