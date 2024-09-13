'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: "roles_permissions",
        foreignKey: "permission_id",
        as: "roles",
        onDelete: "CASCADE"
      })
    }
  }
  Permission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    permission: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Permission;
};