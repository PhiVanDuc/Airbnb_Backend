'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: "first_user_id",
        as: "first_user"
      });

      Conversation.belongsTo(models.User, {
        foreignKey: "second_user_id",
        as: "second_user"
      });

      Conversation.hasMany(models.Message, {
        foreignKey: "conversation_id",
        as: "messages",
        onDelete: "CASCADE"
      });
    }
  }
  Conversation.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    first_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    second_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'conversations',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Conversation;
};