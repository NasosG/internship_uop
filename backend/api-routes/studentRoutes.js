const express = require('express');
const router = express.Router()
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get('/', studentController.getStudents);
router.put("/updateStudentDetails/:id", checkAuth, studentController.updateStudentDetails);
router.put("/updateStudentContractDetails/:id", checkAuth, studentController.updateStudentContractDetails);
router.put("/updateStudentBio/:id", checkAuth, studentController.updateStudentBio);
router.put("/updateStudentContact/:id", checkAuth, studentController.updateStudentContact);
router.post("/insertStudentEntrySheet/:id", checkAuth, studentController.insertStudentEntrySheet);
router.post("/insertStudentExitSheet/:id", checkAuth, studentController.insertStudentExitSheet);
router.put("/updateStudentEntrySheet/:id", checkAuth, studentController.updateStudentEntrySheet);
router.put("/updateStudentPositionPriorities/:id", checkAuth, studentController.updateStudentPositionPriorities);
router.get("/getStudentEntrySheets/:id", studentController.getStudentEntrySheets);
router.get("/getStudentExitSheets/:id", studentController.getStudentExitSheets);
router.get("/getStudentEvaluationSheets/:id", studentController.getStudentEvaluationSheets);
router.get("/getStudentPositions/:id", studentController.getStudentPositions);
router.post("/insertStudentEvaluationSheet/:id", checkAuth, studentController.insertStudentEvaluationSheet);
router.delete("/deleteEntryFormByStudentId/:id", checkAuth, studentController.deleteEntryFormByStudentId);
router.delete("/deletePositionByStudentId/:id", checkAuth, studentController.deletePositionByStudentId);
// router.post("/updateStudentSSNFile/:id", studentController.updateStudentSSNFile);

module.exports = router;
