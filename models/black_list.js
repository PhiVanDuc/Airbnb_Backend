'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Black_List extends Model {
    static associate(models) {
    }
  }
  Black_List.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    expiry_time: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Black_List',
    tableName: 'black_lists',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Black_List;
};