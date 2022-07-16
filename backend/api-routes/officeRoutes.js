const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const officeController = require("../controllers/officeController.js");

router.get("/getOfficeUserById/:id", officeController.getOfficeUserById);
router.get("/getPeriodByDepartmentId/:id", officeController.getPeriodByDepartmentId);

module.exports = router;
