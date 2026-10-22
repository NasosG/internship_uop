const express = require('express');
const router = express.Router();
const checkLoginSecret = require("../middleware/loginSecret.js");
const checkAuth = require("../middleware/auth.js");
const officeController = require("../controllers/officeController.js");

router.get("/getOfficeUserById/:id", checkAuth, officeController.getOfficeUserById);
router.get("/getPeriodByDepartmentId/:id", checkAuth, officeController.getPeriodByDepartmentId);
router.get("/getStudentsWithSheetInput/:period_id", checkAuth, officeController.getStudentsWithSheetInput);
router.get("/getStudentsWithSheetOutput/:period_id", checkAuth, officeController.getStudentsWithSheetOutput);
router.get("/getAcademicsByOfficeUserId/:id", checkAuth, officeController.getAcademicsByOfficeUserId);
router.get("/getEspaPositionsByDepartmentId/:id", checkAuth, officeController.getEspaPositionsByDepartmentId);
router.get("/getStudentListForPeriodAndAcademic/", checkAuth, officeController.getStudentListForPeriodAndAcademic);
router.get("/getStudentPaymentsListForPeriodAndAcademic", checkAuth, officeController.getStudentPaymentsListForPeriodAndAcademic);;
router.post("/insertEspaPosition/:id", checkAuth, officeController.insertEspaPosition);
router.post("/login/", checkLoginSecret, officeController.login);
router.put("/updateEntrySheetField/:id", checkAuth, officeController.updateEntrySheetField);
router.put("/updateExitSheetField/:id", checkAuth, officeController.updateExitSheetField);
router.get("/stats/achievements", checkAuth, officeController.getAchievementsStats);
router.get("/stats/achievements/students", checkAuth, officeController.getAchievementsStatsForStudents);
router.get("/stats/achievements/students/:year", checkAuth, officeController.getAchievementsYearlyStatsForStudents);

module.exports = router;
