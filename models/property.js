'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      Property.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users"
      });

      Property.belongsTo(models.Category, {
        foreignKey: "structure",
        as: "categories",
      });

      Property.belongsToMany(models.Utility, {
        through: "utilities_properties",
        foreignKey: "property_id",
        as: "utilities",
        onDelete: "CASCADE"
      });

      Property.hasMany(models.Image, {
        foreignKey: "property_id",
        as: "images",
        onDelete: "CASCADE"
      });

      Property.hasMany(models.Reservation, {
        foreignKey: "property_id",
        as: "reservations",
        onDelete: "SET NULL"
      });
    }
  }
  Property.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    structure: {
      type: DataTypes.UUID,
    },
    privacy_type: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT
    },
    longitude: {
      type: DataTypes.FLOAT
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    people_count: {
      type: DataTypes.INTEGER
    },
    bedroom_count: {
      type: DataTypes.INTEGER
    },
    beds_count: {
      type: DataTypes.INTEGER
    },
    bathroom_count: {
      type: DataTypes.INTEGER
    },
    property_count: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    base_price: {
      type: DataTypes.FLOAT
    },
    profit_price: {
      type: DataTypes.FLOAT
    },
    create_complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Property',
    tableName: 'properties',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Property;
};