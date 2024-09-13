'use strict';

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("permissions", [
      {
        id: uuidv4(),
        permission: "dashboard_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "dashboard_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "roles_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "roles_add",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "roles_detail",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "roles_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "roles_delete",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "accounts_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "accounts_add",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "accounts_detail",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "accounts_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "accounts_delete",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "categories_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "categories_add",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "categories_detail",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "categories_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "categories_delete",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "filters_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "filters_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "utilities_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "utilities_add",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "utilities_detail",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "utilities_edit",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "utilities_delete",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "feedback_view",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        permission: "feedback_response",
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("permissions", null, {});
  }
};