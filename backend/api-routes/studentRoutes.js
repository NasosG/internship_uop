const express = require('express');
const router = express.Router()
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get('/', studentController.getStudents);
router.post("/updateStudentDetails/:id", checkAuth, studentController.updateStudentDetails);
router.post("/updateStudentContractDetails/:id", checkAuth, studentController.updateStudentContractDetails);
router.post("/updateStudentBio/:id", checkAuth, studentController.updateStudentBio);
router.post("/updateStudentContact/:id", checkAuth, studentController.updateStudentContact);
router.post("/insertStudentEntrySheet/:id", checkAuth, studentController.insertStudentEntrySheet);
router.post("/updateStudentEntrySheet/:id", checkAuth, studentController.updateStudentEntrySheet);
router.get("/getStudentEntrySheets/:id", studentController.getStudentEntrySheets);
router.delete("/deleteEntryFormByStudentId/:id", studentController.deleteEntryFormByStudentId);
// router.post("/updateStudentSSNFile/:id", studentController.updateStudentSSNFile);

module.exports = router;
