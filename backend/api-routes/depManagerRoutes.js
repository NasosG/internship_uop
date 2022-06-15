const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const depManagerController = require("../controllers/depManagerController.js");

router.get("/getDepManagerById/:id", depManagerController.getDepManagerById);
router.get("/getPeriodByUserId/:id", depManagerController.getPeriodByUserId);
router.get("/getStudentsApplyPhase/:id", depManagerController.getStudentsApplyPhase);
router.get("/getRankedStudentsByDeptId/:id", depManagerController.getRankedStudentsByDeptId);
router.get("/getStudentActiveApplications/:id", depManagerController.getStudentActiveApplications);
router.post("/insertPeriod/:id", depManagerController.insertPeriod);
router.post("/insertApprovedStudentsRank/:id", depManagerController.insertApprovedStudentsRank);
router.put("/updatePhaseByStudentId/:id", depManagerController.updatePhaseByStudentId);
router.put("/updatePeriodById/:id", depManagerController.updatePeriodById);
router.put("/updateStudentRanking/:id", depManagerController.updateStudentRanking);
router.delete("/deletePeriodById/:id", depManagerController.deletePeriodById);

module.exports = router;
