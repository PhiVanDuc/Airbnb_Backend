'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: "users_roles",
        foreignKey: "role_id",
        as: "users",
        onDelete: "CASCADE"
      });

      Role.belongsToMany(models.Permission, {
        through: "roles_permissions",
        foreignKey: "role_id",
        as: "permissions",
        onDelete: "CASCADE"
      });
    }
  }
  Role.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Role;
};