'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      Bill.belongsTo(models.Reservation, {
        foreignKey: "reservation_id",
        as: "reservations"
      });
    }
  }
  Bill.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    reservation_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    payment_intent_id: {
      type: DataTypes.STRING
    },
    nights: {
      type: DataTypes.INTEGER
    },
    base_price: {
      type: DataTypes.DOUBLE
    },
    airbnb_fee_service: {
      type: DataTypes.DOUBLE
    },
    total_amount: {
      type: DataTypes.DOUBLE
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Upcoming'
    }
  }, {
    sequelize,
    modelName: 'Bill',
    tableName: 'bills',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Bill;
};