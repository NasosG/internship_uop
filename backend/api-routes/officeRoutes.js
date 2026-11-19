const express = require('express');
const router = express.Router();
const checkLoginSecret = require("../middleware/loginSecret.js");
const { checkUniversityUser, checkStaff } = require("../middleware/access.js");
const officeController = require("../controllers/officeController.js");

router.get("/getOfficeUserById/:id", checkUniversityUser, officeController.getOfficeUserById);
router.get("/getPeriodByDepartmentId/:id", checkUniversityUser, officeController.getPeriodByDepartmentId);
router.get("/getStudentsWithSheetInput/:period_id", checkUniversityUser, officeController.getStudentsWithSheetInput);
router.get("/getStudentsWithSheetOutput/:period_id", checkUniversityUser, officeController.getStudentsWithSheetOutput);
router.get("/getAcademicsByOfficeUserId/:id", checkUniversityUser, officeController.getAcademicsByOfficeUserId);
router.get("/getEspaPositionsByDepartmentId/:id", checkUniversityUser, officeController.getEspaPositionsByDepartmentId);
router.get("/getStudentListForPeriodAndAcademic/", checkUniversityUser, officeController.getStudentListForPeriodAndAcademic);
router.get("/getStudentPaymentsListForPeriodAndAcademic", checkUniversityUser, officeController.getStudentPaymentsListForPeriodAndAcademic);;
router.post("/insertEspaPosition/:id", checkUniversityUser, officeController.insertEspaPosition);
router.post("/login/", checkLoginSecret, officeController.login);
// The office edits the students' entry / exit sheets (staff only, not the students themselves)
router.put("/updateEntrySheetField/:id", checkStaff, officeController.updateEntrySheetField);
router.put("/updateExitSheetField/:id", checkStaff, officeController.updateExitSheetField);
router.get("/stats/achievements", checkUniversityUser, officeController.getAchievementsStats);
router.get("/stats/achievements/students", checkUniversityUser, officeController.getAchievementsStatsForStudents);
router.get("/stats/achievements/students/:year", checkUniversityUser, officeController.getAchievementsYearlyStatsForStudents);

module.exports = router;
