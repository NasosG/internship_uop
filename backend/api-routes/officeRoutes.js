const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const officeController = require("../controllers/officeController.js");

router.get("/getOfficeUserById/:id", officeController.getOfficeUserById);
router.get("/getPeriodByDepartmentId/:id", officeController.getPeriodByDepartmentId);
router.post("/insertEspaPosition/:id", officeController.insertEspaPosition);
router.post("/login/", officeController.login);
router.put("/updateEntrySheetField/:id", officeController.updateEntrySheetField);
router.put("/updateExitSheetField/:id", officeController.updateExitSheetField);
router.get("/getStudentsWithSheetInput/:department_id", officeController.getStudentsWithSheetInput);
router.get("/getStudentsWithSheetOutput/:department_id", officeController.getStudentsWithSheetOutput);

module.exports = router;
