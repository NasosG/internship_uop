const studentService = require("../services/studentService.js");
// const companyService = require("../services/companyService.js");
const depManagerService = require("../services/depManagerService.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = require("../middleware/file.js");
const formidable = require('formidable');
const MiscUtils = require("../MiscUtils.js");
const atlasController = require("./atlasController");
const moment = require('moment');
require('dotenv').config();

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// app.post("/api/students/login/:id", (request, response, next) => {
const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await studentService.loginStudent(uname);

  console.log("uid " + userId);

  if (userId == null)
    response.status(401).json({
      message: 'Unauthorized'
    });
  else {
    const token = jwt.sign({
      userId: userId
    },
      "secret_this_should_be_longer", {
      expiresIn: "1h"
    });
    response.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: userId
    });
  }
};

/**
 * Returns all students from SSO and student users tables.
 */
const getAllStudents = async (request, response) => {
  try {
    const students = await studentService.getAllStudents();
    response.status(200).json(students);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentById = async (request, response) => {
  try {
    const studentId = request.params.id;
    const student = await studentService.getStudentById(studentId);
    response.status(200).json(student);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentFilesForAppPrint = async (request, response) => {
  try {
    const studentId = request.params.id;
    const doctypes = await studentService.getStudentFilesForAppPrint(studentId);
    response.status(200).json(doctypes);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getPhase = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const period = await studentService.getPhase(departmentId);
    response.status(200).json(period);
  } catch (error) {
    console.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

const getMergedDepartmentInfoByStudentId = async (request, response) => {
  try {
    const studentId = request.params.id;
    const departments = await studentService.getMergedDepartmentInfoByStudentId(studentId);
    response.status(200).json(departments);
  } catch (error) {
    console.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

const getStudentEntrySheets = async (request, response) => {
  try {
    const id = request.params.id;
    const entrySheets = await studentService.getStudentEntrySheets(id);
    response.status(200).json(entrySheets.rows);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentApplications = async (request, response) => {
  try {
    const id = request.params.id;
    const applications = await studentService.getStudentApplications(id);
    response.status(200).json(applications.rows);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentActiveApplication = async (request, response) => {
  try {
    // console.log("student active app");
    const id = request.params.id;
    const applications = await studentService.getStudentActiveApplication(id);
    response.status(200).json(applications.rows[0].count);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentExitSheets = async (request, response) => {
  try {
    const id = request.params.id;
    const exitSheets = await studentService.getStudentExitSheets(id);
    response.status(200).json(exitSheets);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentEvaluationSheets = async (request, response) => {
  try {
    const id = request.params.id;
    const exitSheets = await studentService.getStudentEvaluationSheets(id);
    response.status(200).json(exitSheets);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentPositions = async (request, response) => {
  try {
    const id = request.params.id;
    const studentPositions = await studentService.getStudentPositions(id);
    response.status(200).json(studentPositions);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getCommentByStudentIdAndSubject = async (request, response) => {
  try {
    const id = request.query.studentId;
    const subject = request.query.subject;

    const comment = await studentService.getCommentByStudentIdAndSubject(id, subject);

    response.status(200).json(comment);
  } catch (error) {
    response.status(404).send({
      message: error.message
    });
  }
};

const getAssignmentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const assignments = await studentService.getAssignmentsByStudentId(id);
    response.status(200).json(assignments);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentDetails(student, id);
    // console.log(inserts.rowCount);
    response
      .status(200)
      .json({
        message: 'Student details updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentContractDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentContractDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student contract details updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentExtraContractDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    await studentService.updateStudentExtraContractDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student contract details updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentBio = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentBio(student, id);

    response
      .status(200)
      .json({
        message: 'Student bio updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentContact = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentContact(student, id);

    response
      .status(200)
      .json({
        message: 'Student contact updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentSpecialDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentSpecialDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student contact updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentPositionPriorities = async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;

    await studentService.updateStudentPositionPriorities(id, body);

    response
      .status(200)
      .json({
        message: 'Student position priorities updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentEntrySheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentEntrySheet(student, id);

    response
      .status(200)
      .json({
        message: 'Student entry sheet was updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};


const updatePhase = async (request, response, next) => {
  try {
    const id = request.params.id;
    const phaseNumber = request.body.phase;
    console.log("phase number" + phaseNumber + "-ID" + id);

    await studentService.updatePhase(phaseNumber, id);

    response
      .status(200)
      .json({
        message: 'Student phase updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentEntrySheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentEntrySheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student entry sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentExitSheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentExitSheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student exit sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentEvaluationSheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentEvaluationSheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student evaluation sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentApplication = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    await studentService.insertStudentApplication(student, id);

    response
      .status(201)
      .json({
        message: 'Student application was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentPosition = async (request, response, next) => {
  try {
    let message = "";
    const studentId = request.params.id;
    const body = request.body;
    let priority = 0;
    const NUMBER_OF_POSITIONS = 5;
    // let positionId = body.positionId == null ? body.internal_position_id : body.positionId;
    // let atlas = body.positionId != null;

    // by the new law, there are only atlas positions, not internal ones
    let positionId = body.positionId;
    let atlas = true;

    // console.log(body.internal_position_id + "|" + atlas);
    const maxPriority = await studentService.findMaxPositions(studentId, positionId);

    if (maxPriority < NUMBER_OF_POSITIONS) {
      // priority is +1 from the previous position (which we know by max priority)
      priority = maxPriority + 1;
      //console.log(priority, maxPriority, body.positionId, studentId);
      await studentService.insertStudentPositionsFromUser(studentId, positionId, priority, atlas);
      message = "Student position was inserted successfully";
    } else {
      console.log("insertStudentPosition(), Student can't choose more than 5 positions");
      message = "Student can't choose more than 5 positions";
    }

    response
      .status(201)
      .json({
        message: message
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deleteEntryFormByStudentId = async (request, response) => {
  const id = request.params.id;
  try {
    const results = await studentService.deleteEntryFormByStudentId(id);
    response
      .status(200)
      .send(`entry form of student with ID: ${id} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deletePositionsByStudentId = async (request, response) => {
  const studentId = request.params.id;
  try {
    await studentService.deletePositionsByStudentId(studentId);
    response
      .status(200)
      .send(`student position with priority ${studentId} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deleteApplicationById = async (request, response) => {
  const applicationId = request.params.id;
  try {
    await studentService.deleteApplicationById(applicationId);
    response
      .status(200)
      .send(`student application ${applicationId} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentPositions = async (request, response) => {
  try {
    const id = request.params.id;
    const body = request.body;
    await studentService.updateStudentPositions(id, body);

    response
      .status(200)
      .json({
        message: 'Student positions were updated successfully'
      });
  } catch (error) {
    console.log(error.message);
    response.send({
      message: error.message
    });
  }
};

const validateFile = async (request, response, err, fileType) => {
  try {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.

      // File type not valid
      if (err.message.includes("This file type is not valid")) {
        throw new Error("Multer error: The file type was not valid for" + fileType + "upload");
      }

      throw new Error("A generic Multer error occurred");
    } else if (err) {
      // An unknown error occurred when uploading.

      // File type not valid
      if (err.message.includes("This file type is not valid")) {
        throw new Error("Unkown Error: The file type was not valid for" + fileType + " upload");
      }

      throw new Error("An unknown error occurred");
    }
    response
      .status(201)
      .json({
        message: "FILE ADDED"
      });
  } catch (error) {
    // return (err.message);
    console.log(err.message);
    response.status(201).json({
      message: 'ERROR'
    });
  }
};

const insertToDB = async (request, response, ssoUserId, fileType, filePath, fileName) => {
  let form = new formidable.IncomingForm();
  let fileExtension;

  await new Promise(function (resolve, reject) {
    form.parse(request, (err, fields, files) => {
      if (err) {
        console.log("An error on form parsing occurred");
        reject(err);
        return;
      }
      let mimetype = files.file.mimetype;
      fileExtension = mimetype.split("/")[1];
      console.log("In form.parse method, file extension is: " + fileExtension);
      resolve(fileExtension);
    });
  });

  fileExtension = MiscUtils.formatDocExtension(fileExtension);
  fileName += '.' + fileExtension;

  await studentService.insertOrUpdateMetadataBySSOUid(ssoUserId, fileType, filePath, fileName, fileExtension);
};

const insertSSNFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "SSN";
    const userType = "student";
    let fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/ssns/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.ssn(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED SSN"
      });

  } catch (err) {
    console.log(err);
    response
      .status(201)
      .json({
        message: "ERROR"
      });
  }
};

const insertIbanFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "IBAN";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/ibans/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.iban(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED IBAN"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const insertAMEAFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "AMEA";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/amea/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.amea(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED IBAN"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const insertAffidavitFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "AFFIDAVIT";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/affidavit/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.affidavit(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED AFFIDAVIT"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const insertAMAFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "AMA";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/ama/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.ama(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED AMA"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const insertIdentityCardFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "IDENTITY";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/identity/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.policeId(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED IDENTITY CARD"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const sendFile = async (request, response) => {
  try {
    const id = request.params.id;
    const docType = request.body.doctype;
    let initialPath = process.env.DEPT_MANAGER_PREVIEW_FILE_PATH;

    let metadata = (await studentService.getFileMetadataByStudentId(id, docType)).rows[0];
    const path = require('path');

    response
      .status(200)
      .sendFile(initialPath + metadata.file_path + '/' + metadata.file_name);

  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertAssignment = async (request, response, next) => {
  try {
    const studentId = request.params.id;
    const assignmentData = request.body.assignment;
    const implementationDates = request.body.implementationDates;
    let isTEIProgramOfStudy = false;

    console.log("in final assign of student");
    console.log(assignmentData);
    console.log("studentId " + studentId);

    // Get student's AM and department id by student id
    //let studentAMNumber = '2022201400155'; // for atlas pilotiko testing
    const student = await depManagerService.getStudentAMandDepartmentByIdForAtlas(assignmentData.student_id);
    // const { registry_number: studentAMNumber, department_id: academicId } = student;

    const studentAMNumber = student.registry_number;
    let academicId = student.department_id;

    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (academicId.toString().length == 6) {
      isTEIProgramOfStudy = true;
      academicId = MiscUtils.getAEICodeFromDepartmentId(academicId);
    }

    console.log(studentAMNumber);
    console.log(academicId);

    let studentAcademicIdNumber = await atlasController.findAcademicIdNumber(academicId, studentAMNumber);
    let academicIDNumber = studentAcademicIdNumber.message.AcademicIDNumber; //243761386827
    console.log(academicIDNumber);

    let registeredStudent = await atlasController.getRegisteredStudent(academicIDNumber);
    console.log(registeredStudent);

    let registerResult;
    // the below line is possibly the right one; gets academicId from AM and department id
    // let registeredStudent = await atlasController.findAcademicIdNumber(academicId, studentAMNumber);
    if (registeredStudent.message != null) {
      console.log('user is registered');
      // console.log(registeredStudent.message.AcademicIDNumber);
    } else {
      console.log('not a registered user');
      // Student SHOULD sign up on this occassion
      registerResult = await atlasController.registerNewStudent(academicIDNumber);
      console.log(registerResult);
    }
    // console.log(registeredStudent);

    // TO BE TESTED
    // const preassignResult = await companyService.getPreassignModeByDepartmentId(98);
    // console.log(preassignResult.preassign);
    console.log(assignmentData.position_id);
    let positionPreassignment = await atlasController.getPositionPreassignment(assignmentData.position_id, academicId);
    console.log(positionPreassignment);

    // const fundingType = await atlasController.getFundingType(assignmentData.position_id);
    // console.log(fundingType);

    const studentToAssignID = registeredStudent?.message?.ID || registerResult?.message?.ID;

    try {
      console.log("be4 final assign of student");
      // assign student to Atlas position
      let assignResults = await atlasController.assignStudent(positionPreassignment, studentToAssignID, isTEIProgramOfStudy, implementationDates);
      console.log("after final assign of student");
      // If assignment fails, throw an error displaying the message
      if (assignResults.status == "400 bad request") {
        console.error(assignResults.message);
        throw new Error(assignResults.message);
      }
      // If assignment fails for business reason, throw an error displaying the message
      if (!assignResults.message.Success) {
        console.error("atlas assign failed: " + assignResults.message.Message);
        throw new Error(assignResults.message.Message);
      }

      console.log(assignResults);
    } catch (error) {
      console.error(error.message);
      response.status(500)
        .json({
          message: error.message
        });
      return;
    }

    // update assignment details - local db
    await studentService.acceptAssignment(assignmentData);

    console.log('successful final assignment for student ' + studentId);
    response.status(201)
      .json({
        message: "assignment was inserted successfully"
      });
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const insertOrUpdateDepartmentDetails = async (request, response) => {
  const studentId = request.params.id;
  const studentData = request.body.data;
  console.log(request.body);
  try {
    const resultsFound = await studentService.mergedDepartmentResultFound(studentId, studentData);
    if (resultsFound) {
      await studentService.updateMergedDepartmentDetails(studentId, studentData);
    } else {
      await studentService.insertMergedDepartmentDetails(studentId, studentData);
    }
    response.status(200)
      .json({
        message: 'Merged department rel updated/inserted successfully'
      });
  } catch (error) {
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const checkUserAcceptance = async (request, response) => {
  const studentId = request.params.id;
  try {
    const resultsFound = await studentService.checkUserAcceptance(studentId);

    response.status(200)
      .json({
        message: 'User acceptance checked successfully',
        accepted: resultsFound
      });

  } catch (error) {
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const insertUserAcceptance = async (request, response) => {
  const studentId = request.params.id;
  const areTermsAccepted = request.body.areTermsAccepted;

  try {
    await studentService.insertUserAcceptance(studentId, areTermsAccepted);

    response.status(200).json({
      message: 'User acceptance updated/inserted successfully'
    });
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

const insertStudentInterestApp = async (request, response) => {
  try {
    const studentId = request.params.id;
    const body = request.body;

    console.log(body);
    const results = await studentService.semesterInterestAppFound(studentId, body.periodId);
    if (results.found) {
      await studentService.insertOrUpdateStudentInterestApp(studentId, body, results.appId, "update");
    } else {
      await studentService.insertOrUpdateStudentInterestApp(studentId, body, "insert");
    }

    response.status(200).json({
      message: 'Student interest app inserted successfully',
    });
  } catch (error) {
    console.log(error);
    response.status(401).json({
      message: error.message
    });
  }
};

const updateDepartmentIdByStudentId = async (request, response) => {
  const studentId = request.params.id;
  const departmentId = request.body.departmentId;

  try {
    await studentService.updateDepartmentIdByStudentId(studentId, departmentId);
    response.status(200).json({
      message: 'Department id updated successfully'
    });
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

const getProtocolNumberIfInterestAppExists = async (request, response) => {
  const studentId = request.query.studentId;
  const periodId = request.query.periodId;

  try {
    const results = await studentService.getSemesterProtocolNumberIfExistsOrNull(studentId, periodId);
    if (results.found) {
      const protocolNumber = results.protocolNumber;
      response.status(200).json({
        message: 'Protocol number retrieved successfully',
        protocolNumber: protocolNumber
      });
    } else {
      response.status(404).json({
        message: 'Protocol number was not found',
        protocolNumber: null
      });
    }
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

const getStudentRankedApprovalStatusForPeriod = async (request, response) => {
  const studentId = request.query.studentId;
  const periodId = request.query.periodId;

  try {
    const approvalState = await studentService.getStudentRankedApprovalStatusForPeriod(studentId, periodId);
    //console.log(`Student's ranked approval status for period ${periodId} has been successfully retrieved.`);
    response.status(200).json(approvalState);
  } catch (error) {
    console.log(`Student's ranked approval status for period ${periodId} has NOT been retrieved.`);
    response.status(401).json({
      message: error.message
    });
  }
};

const checkPositionOfAtlasExists = async (request, response) => {
  const studentId = request.params.id;
  const positions = request.body.positions;

  try {
    let notExist = [];
    let notExistantPriorities = [];
    for (const position of positions) {
      const token = await atlasController.atlasLogin();
      const results = await atlasController.getPositionGroupDetails(position.position_id, token);

      if (!results.message) {
        notExist.push(position.position_id);
        notExistantPriorities.push(position.priority);
      }
    }
    if (notExist.length > 0) {
      response.status(404).json({
        message: 'Position of atlas does not exist',
        exists: false,
        notExist: notExist,
        notExistantPriorities: notExistantPriorities
      });
    } else {
      response.status(200).json({
        message: 'Position of atlas exists',
        exists: true
      });
    }
  } catch (error) {
    response.status(400).json({
      message: error.message
    });
  }
};

const produceContractFile = async (request, response) => {
  try {
    console.log("produceContractFile");
    const studentId = request.params.id;
    const docType = request.body.doctype;
    const periodId = request.body.periodId;
    const departmentId = request.body.departmentId;

    let metadata = await studentService.getContractFileMetadataByStudentId(studentId, periodId);
    console.log(metadata);

    const fileDirAEI = process.env.CONTRACT_FILE_PATH_AEI;
    const fileDirTEI = process.env.CONTRACT_FILE_PATH_TEI;

    let content;

    if (departmentId.toString().length < 6) {
      // Load the docx file as binary content
      content = fs.readFileSync(
        path.resolve(fileDirAEI),
        "binary"
      );
    } else {
      // Load the docx file as binary content
      content = fs.readFileSync(
        path.resolve(fileDirTEI),
        "binary"
      );
    }

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace placeholders {first_name} by John etc.)
    doc.render({
      CONTRACT_DATE: !metadata.contract_date ? "………………" : moment(metadata.contract_date).format('DD/MM/YYYY'),
      COMPANY_NAME: metadata.company_name,
      COMPANY_AFM: metadata.company_afm,
      COMPANY_ADDRESS: !metadata.company_address ? "…………………………………………….." : metadata.company_address,
      COMPANY_LIAISON: !metadata.company_liaison ? "………………" : metadata.company_liaison,
      COMPANY_LIAISON_POSITION: !metadata.company_liaison_position ? "………………" : metadata.company_liaison_position,
      STUDENT_NAME: metadata.displayname,
      STUDENT_FATHER_NAME: metadata.father_name,
      DEPT_NAME: metadata.dept_name,
      ID_NUMBER: !metadata.id_number ? "………………" : metadata.id_number,
      AMIKA: !metadata.amika ? "………………" : metadata.amika,
      AMKA: metadata.amka,
      AFM: metadata.afm,
      DOY_NAME: metadata.doy_name,
      PA_SUBJECT: !metadata.pa_subject ? "………………" : metadata.pa_subject,
      PA_SUBJECT_ATLAS: !metadata.pa_subject_atlas ? "………………" : metadata.pa_subject_atlas,
      PA_START_DATE: moment(metadata.pa_start_date).format('DD/MM/YYYY'),
      PA_END_DATE: moment(metadata.pa_end_date).format('DD/MM/YYYY'),
      TY_NAME: metadata.department_manager_name,
      APOFASI_ADA_NUMBER: !metadata.ada_number ? "……………………………………………..." : metadata.ada_number,
      STUDENT_WAGES: !metadata.student_wages ? "……………… " : metadata.student_wages
    });

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    const fileName = "student" + studentId + "_CONTRACT.docx";
    const filePath = `../uploads/contracts/${studentId}`;

    // Make a folder if not exists
    fs.mkdirSync(filePath, { recursive: true });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(filePath, fileName), buf);

    response
      .status(200)
      .sendFile(path.resolve(filePath, fileName), buf);

  } catch (error) {
    console.error(error.message);
    response.status(401).json({
      message: error.message
    });
  }
};

const isStudentInAssignmentList = async (request, response) => {
  try {
    const studentId = request.params.id;
    const isStudentInAssignmentList = await studentService.isStudentInAssignmentList(studentId);
    response.status(200).json(isStudentInAssignmentList);
  } catch (error) {
    console.error(error.message);
    response.status(400).json({
      message: error.message
    });
  }
};

const getContractDetailsByStudentIdAndPeriod = async (request, response) => {
  try {
    const studentId = request.query.studentId;
    const periodId = request.query.periodId;

    const contractDetails = await studentService.getContractFileMetadataByStudentId(studentId, periodId);

    response.status(200).json(contractDetails);
  } catch (error) {
    console.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const updateContractDetails = async (request, response) => {
  try {
    const studentId = request.params.id;
    const periodId = request.body.periodId;
    const contract = request.body.contract;

    const contractDetails = await studentService.updateContractDetails(studentId, periodId, contract);

    response.status(200).json({
      message: "contract Details were updated successfully"
    });
  } catch (error) {
    console.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getLatestPeriodOfStudent = async (request, response) => {
  try {
    const studentId = request.query.studentId;
    const departmentId = request.query.departmentId;

    const periodMaxId = await studentService.getLatestPeriodOfAssignedStudent(departmentId, studentId);

    if (periodMaxId === null) {
      response.status(204).send({
        message: "No results for assigned student found"
      });
    } else {
      response.status(200).json(periodMaxId);
    }
  } catch (error) {
    console.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentEntrySheets,
  getStudentExitSheets,
  getStudentEvaluationSheets,
  getStudentPositions,
  getStudentApplications,
  getStudentActiveApplication,
  getPhase,
  getCommentByStudentIdAndSubject,
  getAssignmentsByStudentId,
  getStudentRankedApprovalStatusForPeriod,
  getContractDetailsByStudentIdAndPeriod,
  getLatestPeriodOfStudent,
  isStudentInAssignmentList,
  checkPositionOfAtlasExists,
  insertStudentEntrySheet,
  insertStudentExitSheet,
  insertStudentEvaluationSheet,
  insertStudentApplication,
  insertStudentPosition,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentExtraContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentSpecialDetails,
  updateStudentEntrySheet,
  updateStudentPositionPriorities,
  updateStudentPositions,
  updatePhase,
  updateContractDetails,
  deleteEntryFormByStudentId,
  deletePositionsByStudentId,
  deleteApplicationById,
  //dummy login
  login,
  insertSSNFile,
  insertIbanFile,
  insertAMEAFile,
  insertAffidavitFile,
  sendFile,
  insertAssignment,
  insertOrUpdateDepartmentDetails,
  checkUserAcceptance,
  insertUserAcceptance,
  insertStudentInterestApp,
  insertAMAFile,
  insertIdentityCardFile,
  getMergedDepartmentInfoByStudentId,
  updateDepartmentIdByStudentId,
  getProtocolNumberIfInterestAppExists,
  getStudentFilesForAppPrint,
  produceContractFile
};
