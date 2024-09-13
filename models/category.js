'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Property, {
        foreignKey: "structure",
        as: "properties",
        onDelete: "SET NULL"
      })
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: null,
      unique: true
    },
    category_type: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    prefix_icon: {
      type: DataTypes.STRING,
      allowNull: null,
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Category;
};