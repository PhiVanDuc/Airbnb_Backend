'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bills', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      reservation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "reservations",
          id: "id"
        },
        onDelete: "CASCADE"
      },
      payment_intent_id: {
        type: Sequelize.STRING
      },
      nights: {
        type: Sequelize.INTEGER
      },
      base_price: {
        type: Sequelize.DOUBLE
      },
      airbnb_fee_service: {
        type: Sequelize.DOUBLE
      },
      total_amount: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('bills');
  }
};