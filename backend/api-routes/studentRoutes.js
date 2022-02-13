const express = require('express');
const router = express.Router()
const studentController = require("../controllers/studentController.js");
const studentService = require("../services/studentService.js");

/* Student Routes */
router.get('/', studentController.getStudents);
router.post("/updateStudentDetails/:id", studentController.updateStudentDetails);
router.post("/updateStudentContractDetails/:id", studentController.updateStudentContractDetails);
router.post("/updateStudentBio/:id", studentController.updateStudentBio);
router.post("/updateStudentContact/:id", studentController.updateStudentContact);
// router.post("/updateStudentSSNFile/:id", studentController.updateStudentSSNFile);

module.exports = router
