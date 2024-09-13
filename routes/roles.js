const express = require('express');
const router = express.Router();

const rolesActionController = require("../controllers/roles_action.controller");

router.post("/", rolesActionController.get_roles);
router.get("/:role_id", rolesActionController.detail_role);
router.post("/add", rolesActionController.add_role);
router.post("/edit/:role_id", rolesActionController.edit_role);
router.delete("/delete/:role_id", rolesActionController.delete_role);

module.exports = router;