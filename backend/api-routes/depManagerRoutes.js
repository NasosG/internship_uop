const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const depManagerController = require("../controllers/depManagerController.js");

router.get("/getDepManagerById/:id", checkAuth, depManagerController.getDepManagerById);
router.get("/getPeriodByUserId/:id", checkAuth, depManagerController.getPeriodByUserId);
router.get("/getStudentsApplyPhase/:id", checkAuth, depManagerController.getStudentsApplyPhase);
router.get("/getRankedStudentsByDeptId/:id", checkAuth, depManagerController.getRankedStudentsByDeptId);
router.get("/getStudentActiveApplications/:id", checkAuth, depManagerController.getStudentActiveApplications);
router.post("/insertPeriod/", checkAuth, depManagerController.insertPeriod);
router.post("/insertApprovedStudentsRank/:id", checkAuth, depManagerController.insertApprovedStudentsRank);
router.put("/updatePhaseByStudentId/:id", checkAuth, depManagerController.updatePhaseByStudentId);
router.put("/updatePeriodById/:id", checkAuth, depManagerController.updatePeriodById);
router.put("/updateStudentRanking/:id", checkAuth, depManagerController.updateStudentRanking);
router.delete("/deletePeriodById/:id", checkAuth, depManagerController.deletePeriodById);
router.post("/login/", depManagerController.login);

module.exports = router;
