'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utility extends Model {
    static associate(models) {
      Utility.belongsToMany(models.Property, {
        through: "utilities_properties",
        foreignKey: "utility_id",
        as: "properties",
        onDelete: "CASCADE"
      });
    }
  }
  Utility.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    utility: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    utility_type: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prefix_icon: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Utility',
    tableName: 'utilities',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Utility;
};