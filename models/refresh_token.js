'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refresh_Token extends Model {
    static associate(models) {
      Refresh_Token.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      })
    }
  }
  Refresh_Token.init({
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
    refresh_token: {
      type: DataTypes.TEXT
    },
    expiry_time: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Refresh_Token',
    tableName: 'refresh_tokens',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Refresh_Token;
};