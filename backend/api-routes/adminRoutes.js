const express = require('express');
const router = express.Router();
const checkLoginSecret = require("../middleware/loginSecret.js");
const checkAuth = require("../middleware/auth.js");
const requireRole = require("../middleware/role.js");
const adminController = require("../controllers/adminController.js");

// Only admins with a valid token
const checkAdmin = [checkAuth, requireRole("admin")];

router.get("/getUsers", checkAdmin, adminController.getUsers);
router.get("/getDepartmentsOfUserByUserID/:id", checkAdmin, adminController.getDepartmentsOfUserByUserID);
router.post("/insertRoles", checkAdmin, adminController.insertRoles);
router.delete("/deleteRolesByUserId/:id", checkAdmin, adminController.deleteUserRoleByUserId);
router.post("/login", checkLoginSecret, adminController.login);
router.get("/studentsWithoutSheets/:departmentId", checkAdmin, adminController.getStudentsWithoutSheets);
router.post("/sendSheetReminders/:departmentId", checkAdmin, adminController.sendSheetReminders);

module.exports = router;
