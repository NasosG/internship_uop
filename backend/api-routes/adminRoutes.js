
const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController.js");

router.get("/getUsers", adminController.getUsers);
router.get("/getDepartmentsOfUserByUserID/:id", adminController.getDepartmentsOfUserByUserID);
router.post('/insertRoles', adminController.insertRoles);

module.exports = router;
