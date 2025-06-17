const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController.js");

router.get("/getUsers", adminController.getUsers);
router.get("/getDepartmentsOfUserByUserID/:id", adminController.getDepartmentsOfUserByUserID);
router.post("/insertRoles", adminController.insertRoles);
router.delete("/deleteRolesByUserId/:id", adminController.deleteUserRoleByUserId);
router.post("/login", adminController.login);
router.get("/studentsWithoutSheets/:departmentId", adminController.getStudentsWithoutSheets);
router.post("/sendSheetReminders/:departmentId", adminController.sendSheetReminders);

module.exports = router;
