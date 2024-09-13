'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Property, {
        foreignKey: "property_id",
        as: "properties"
      })
    }
  }
  Image.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_cover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image_bedroom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image_bathroom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Image;
};