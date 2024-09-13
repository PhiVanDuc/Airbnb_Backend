'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    static associate(models) {
      Provider.hasMany(models.User, {
        foreignKey: "provider_id",
        as: "users"
      });
    }
  }
  Provider.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    provider: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Provider',
    tableName: 'providers',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Provider;
};