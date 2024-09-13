'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Provider, {
        foreignKey: "provider_id",
        as: "providers"
      });

      User.hasMany(models.Refresh_Token, {
        foreignKey: "user_id",
        as: "refresh_tokens",
        onDelete: "CASCADE"
      });

      User.belongsToMany(models.Role, {
        through: "users_roles",
        foreignKey: "user_id",
        as: "roles",
        onDelete: "CASCADE"
      });

      User.hasMany(models.Property, {
        foreignKey: "user_id",
        as: "properties",
        onDelete: "CASCADE"
      });

      User.hasMany(models.Reservation, {
        foreignKey: "customer_id",
        as: "reservations_user",
        onDelete: "SET NULL"
      });

      User.hasMany(models.Reservation, {
        foreignKey: "host_id",
        as: "reservations_host",
        onDelete: "SET NULL"
      });

      User.hasMany(models.Conversation, {
        foreignKey: "first_user_id",
        as: "first_user",
        onDelete: "CASCADE"
      });

      User.hasMany(models.Conversation, {
        foreignKey: "second_user_id",
        as: "second_user",
        onDelete: "CASCADE"
      });

      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "messages",
        onDelete: "CASCADE"
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return User;
};