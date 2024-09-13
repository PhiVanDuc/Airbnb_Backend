'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "host_id",
        as: "hosts"
      });

      Reservation.belongsTo(models.User, {
        foreignKey: "customer_id",
        as: "customers"
      });

      Reservation.belongsTo(models.Property, {
        foreignKey: "property_id",
        as: "properties"
      });

      Reservation.hasOne(models.Bill, {
        foreignKey: "reservation_id",
        as: "bills",
        onDelete: "CASCADE"
      });
    }
  }
  Reservation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    host_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    host_fullname: {
      type: DataTypes.STRING
    },
    host_image: {
      type: DataTypes.TEXT
    },
    host_email: {
      type: DataTypes.STRING
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    customer_fullname: {
      type: DataTypes.STRING
    },
    customer_image: {
      type: DataTypes.TEXT
    },
    customer_email: {
      type: DataTypes.STRING
    },
    customer_number: {
      type: DataTypes.STRING
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    cover_image: {
      type: DataTypes.TEXT
    },
    title: {
      type: DataTypes.STRING
    },
    categories: {
      type: DataTypes.STRING
    },
    check_in: {
      type: DataTypes.DATEONLY
    },
    check_out: {
      type: DataTypes.DATEONLY
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Upcoming'
    }
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Reservation;
};