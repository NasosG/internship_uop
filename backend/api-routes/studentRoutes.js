const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get("/", studentController.getAllStudents);
router.get("/getStudentById/:id", studentController.getStudentById);
router.get("/getStudentApplications/:id", studentController.getStudentApplications);
router.get("/getStudentActiveApplication/:id", studentController.getStudentActiveApplication);
router.get("/getPhase/:id", studentController.getPhase);
router.get("/getStudentEntrySheets/:id", studentController.getStudentEntrySheets);
router.get("/getStudentExitSheets/:id", studentController.getStudentExitSheets);
router.get("/getStudentEvaluationSheets/:id", studentController.getStudentEvaluationSheets);
router.get("/getStudentPositions/:id", studentController.getStudentPositions);
router.get("/getCommentByStudentIdAndSubject/", studentController.getCommentByStudentIdAndSubject);
router.post("/login", studentController.login);
router.post("/insertStudentEntrySheet/:id", /*checkAuth,*/ studentController.insertStudentEntrySheet);
router.post("/insertStudentExitSheet/:id", /*checkAuth,*/ studentController.insertStudentExitSheet);
router.post("/insertStudentApplication/:id", /*checkAuth,*/ studentController.insertStudentApplication);
router.post("/insertStudentPosition/:id", /*checkAuth,*/ studentController.insertStudentPosition);
router.post("/insertStudentEvaluationSheet/:id", /*checkAuth,*/ studentController.insertStudentEvaluationSheet);
router.put("/updateStudentDetails/:id", /*checkAuth,*/ studentController.updateStudentDetails);
router.put("/updateStudentContractDetails/:id", /*checkAuth,*/ studentController.updateStudentContractDetails);
router.put("/updateStudentBio/:id", /*checkAuth,*/ studentController.updateStudentBio);
router.put("/updateStudentContact/:id", /*checkAuth,*/ studentController.updateStudentContact);
router.put("/updatePhase/:id", /*checkAuth,*/ studentController.updatePhase);
router.put("/updateStudentEntrySheet/:id", /*checkAuth,*/ studentController.updateStudentEntrySheet);
router.put("/updateStudentPositionPriorities/:id", /*checkAuth,*/ studentController.updateStudentPositionPriorities);
router.put("/updateStudentPositions/:id", /*checkAuth,*/ studentController.updateStudentPositions);
router.put("/updateStudentSpecialDetails/:id", /*checkAuth,*/ studentController.updateStudentSpecialDetails);
router.delete("/deleteEntryFormByStudentId/:id", /*checkAuth,*/ studentController.deleteEntryFormByStudentId);
router.delete("/deletePositionsByStudentId/:id", /*checkAuth,*/ studentController.deletePositionsByStudentId);
router.delete("/deleteApplicationById/:id", /*checkAuth,*/ studentController.deleteApplicationById);
// file upload routes
router.post("/updateStudentSSNFile/:id", studentController.insertSSNFile);
router.post("/updateStudentIbanFile/:id", studentController.insertIbanFile);
router.post("/updateStudentAMEAFile/:id", studentController.insertAMEAFile);
router.post("/sendFile/:id", studentController.sendFile);
router.get("/getAssignmentsByStudentId/:id", studentController.getAssignmentsByStudentId);
router.post("/insertAssignment/:id", studentController.insertAssignment);

module.exports = router;
