const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const officeController = require("../controllers/officeController.js");

router.get("/getOfficeUserById/:id", officeController.getOfficeUserById);
router.get("/getPeriodByDepartmentId/:id", officeController.getPeriodByDepartmentId);
router.get("/getStudentsWithSheetInput/:period_id", officeController.getStudentsWithSheetInput);
router.get("/getStudentsWithSheetOutput/:period_id", officeController.getStudentsWithSheetOutput);
router.get("/getAcademicsByOfficeUserId/:id", officeController.getAcademicsByOfficeUserId);
router.get("/getEspaPositionsByDepartmentId/:id", officeController.getEspaPositionsByDepartmentId);
router.get("/getStudentListForPeriodAndAcademic/", officeController.getStudentListForPeriodAndAcademic);
router.get("/getStudentPaymentsListForPeriodAndAcademic", officeController.getStudentPaymentsListForPeriodAndAcademic);;
router.post("/insertEspaPosition/:id", officeController.insertEspaPosition);
router.post("/login/", officeController.login);
router.put("/updateEntrySheetField/:id", officeController.updateEntrySheetField);
router.put("/updateExitSheetField/:id", officeController.updateExitSheetField);

module.exports = router;
