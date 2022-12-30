const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const depManagerController = require("../controllers/depManagerController.js");

router.get("/getDepManagerById/:id", depManagerController.getDepManagerById);
router.get("/getPeriodByUserId/:id", depManagerController.getPeriodByUserId);
router.get("/getPeriodByDepartmentId/:id", depManagerController.getPeriodByDepartmentId);
router.get("/getStudentsApplyPhase/:id", depManagerController.getStudentsApplyPhase);
router.get("/getRankedStudentsByDeptId/:id", depManagerController.getRankedStudentsByDeptId);
router.get("/getStudentActiveApplications/:id", depManagerController.getStudentActiveApplications);
router.post("/insertPeriod/", depManagerController.insertPeriod);
router.post("/insertApprovedStudentsRank/:id", depManagerController.insertApprovedStudentsRank);
router.put("/updatePhaseByStudentId/:id", depManagerController.updatePhaseByStudentId);
router.put("/updatePeriodById/:id", depManagerController.updatePeriodById);
router.put("/updateStudentRanking/:id", depManagerController.updateStudentRanking);
router.delete("/deletePeriodById/:id", depManagerController.deletePeriodById);
router.post("/login/", depManagerController.login);
router.post("/insertCommentsByStudentId/:id", depManagerController.insertCommentsByStudentId);
router.put("/updateCommentsByStudentId/:id", depManagerController.updateCommentsByStudentId);
router.get("/getCommentByStudentIdAndSubject/", depManagerController.getCommentByStudentIdAndSubject);
router.get("/getStudentsWithSheetInput/:department_id", depManagerController.getStudentsWithSheetInput);
router.get("/getStudentsWithSheetOutput/:department_id", depManagerController.getStudentsWithSheetOutput);

module.exports = router;
