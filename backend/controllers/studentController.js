// Core Node.js modules
const fs = require("fs");
const path = require("path");
const moment = require('moment');
// Third-party libraries
const jwt = require("jsonwebtoken");
const multer = require("multer");
const formidable = require('formidable');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
// Custom services
const studentService = require("../services/studentService.js");
const depManagerService = require("../services/depManagerService.js");
const atlasController = require("./atlasController");
// Middleware
const upload = require("../middleware/file.js");
// Utilities
const MiscUtils = require("../utils/MiscUtils.js");
// Logging
const logger = require('../config/logger');
// Environment variables
require('dotenv').config();

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await studentService.loginStudent(uname);

  logger.info("uid " + userId);

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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentActiveApplication = async (request, response) => {
  try {
    const id = request.params.id;
    const applications = await studentService.getStudentActiveApplication(id);
    response.status(200).json(applications.rows[0].count);
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentEvaluationSheets = async (request, response) => {
  try {
    const id = request.params.id;
    const evaluationSheets = await studentService.getStudentEvaluationSheets(id);
    response.status(200).json(evaluationSheets);
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentEvaluationSheetsQuestions = async (request, response) => {
  try {
    const evaluationSheetQuestions = await studentService.getStudentEvaluationSheetsQuestions();
    response.status(200).json(evaluationSheetQuestions);
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentContractStatus = async (request, response) => {
  try {
    const studentId = request.params.id;
    const isOldContract = await studentService.isOldContractForStudentId(studentId);
    response.status(200).json(isOldContract);
  } catch (error) {
    logger.error(error.message);
    response.status(500).json({
      error: 'An error occurred while trying to get the contract status',
      message: error.message
    });
  }
};

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student details updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};


const updatePhase = async (request, response, next) => {
  try {
    const id = request.params.id;
    const phaseNumber = request.body.phase;
    logger.info("phase number " + phaseNumber + "-ID" + id);

    await studentService.updatePhase(phaseNumber, id);

    response
      .status(200)
      .json({
        message: 'Student phase updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
    response.status(400).send({
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
    logger.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const insertStudentEvaluationSheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;
    await studentService.insertStudentEvaluationSheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student evaluation sheet was inserted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const produceEvaluationFormFile = async (request, response) => {
  try {
    logger.info("produceEvaluationFormFile endpoint called");

    const studentId = request.params.id;

    let metadata = await studentService.getEvaluationFormMetadataByStudentId(studentId);
    
    // logger.info(req.body);
    // Define the path to the .docx template file
    const fileDir = process.env.EVALUATION_TEMPLATE_FILE_PATH || "./word-contract-templates/Φύλλο αξιολόγησης Φοιτητή ΕΣΠΑ21-27 εκδοση 2.docx";
    logger.info(fileDir);
    // Load the .docx file as binary content
    const content = fs.readFileSync(path.resolve(fileDir), "binary");
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    logger.info(metadata);

    const placeholders = {};
    // Define the replacements for placeholders
    metadata.forEach(item => {
      placeholders[item.question_id] = item.answer_text ?? item.answer_smallint ?? '';
      if (item.answer_smallint) {
        const labels = {
          1: 'Διαφωνώ απόλυτα',
          2: 'Διαφωνώ',
          3: 'Ούτε διαφωνώ ούτε συμφωνώ',
          4: 'Συμφωνώ',
          5: 'Συμφωνώ απόλυτα',
        };
        placeholders[item.question_id] = `${placeholders[item.question_id]} (${labels[placeholders[item.question_id]]})`
      }
    });

    placeholders['displayname'] = metadata[0].displayname ?? '..............';
    placeholders['mail'] = metadata[0].mail ?? '..............';
    placeholders['department'] = metadata[0].department ?? '..............';
    placeholders['digital_signature'] = metadata[0].digital_signature ?? '..............';
    placeholders['asgmt_company_name'] = metadata[0].asgmt_company_name ?? '..............';
    placeholders['submitted_at'] = MiscUtils.formatDatabaseDateToGreekLocaleDate(metadata[0]?.submitted_at);
    placeholders['pa_start_date'] = MiscUtils.formatDatabaseDateToGreekLocaleDate(metadata[0]?.pa_start_date);
    placeholders['pa_end_date'] = MiscUtils.formatDatabaseDateToGreekLocaleDate(metadata[0]?.pa_end_date);
    placeholders['schacpersonaluniquecode'] = MiscUtils.splitStudentsAM(metadata[0].schacpersonaluniquecode) ?? '..............';

    doc.setData(placeholders);
    doc.render();

    // Generate the output document as a buffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Define a file name for the output document
    const fileName = `student_${metadata.studentName || "unknown"}_COMPLETION.docx`;

    // Set headers to prompt the client to download the file
    response.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });

    // Send the document buffer as a response
    response.send(buf);

  } catch (error) {
    logger.error("Error generating completion certificate:", error.message);
    response.status(500).json({
      message: "An error occurred while generating the certificate.",
      error: error.message,
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
    logger.error(error.message);
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

    // logger.info(body.internal_position_id + "|" + atlas);
    const maxPriority = await studentService.findMaxPositions(studentId, positionId);

    if (maxPriority < NUMBER_OF_POSITIONS) {
      // priority is +1 from the previous position (which we know by max priority)
      priority = maxPriority + 1;
      //logger.info(priority, maxPriority, body.positionId, studentId);
      await studentService.insertStudentPositionsFromUser(studentId, positionId, priority, atlas);
      message = "Student position was inserted successfully";
    } else {
      logger.info("insertStudentPosition(), Student can't choose more than 5 positions");
      message = "Student can't choose more than 5 positions";
    }

    response
      .status(201)
      .json({
        message: message
      });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.info(error.message);
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
        throw new Error("Multer error: The file type was not valid for " + fileType + "upload");
      }

      throw new Error("A generic Multer error occurred");
    } else if (err) {
      // An unknown error occurred when uploading.

      // File type not valid
      if (err.message.includes("This file type is not valid")) {
        throw new Error("Unkown Error: The file type was not valid for " + fileType + " upload");
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
    logger.info(err.message);
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
        logger.info("An error on form parsing occurred");
        reject(err);
        return;
      }
      let mimetype = files.file.mimetype;
      fileExtension = mimetype.split("/")[1];
      logger.info("In form.parse method, file extension is: " + fileExtension);
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
    logger.info(err);
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
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
    response.status(201).json({
      message: "ERROR"
    });
  }
};

const insertStudentResignAppFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "RESIGN";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/resign/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.resignApp(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED RESIGN APP"
      });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
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

    if (!metadata) {
      const restrictedDocs = ['RESIGN', 'IDENTITY', 'AMA'];
      if (restrictedDocs.includes(docType)) {
        return response.send({ message: `${docType} FILE NOT given in this phase.` });
      }
      return response.send({ message: "Metadata is missing." });
    }

    response
      .status(200)
      .sendFile(initialPath + metadata.file_path + '/' + metadata.file_name);

  } catch (error) {
    logger.error(error.message);
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

    logger.info("in final assign of student");
    logger.info(assignmentData);
    logger.info("studentId " + studentId);

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

    logger.info(studentAMNumber);
    logger.info(academicId);

    let studentAcademicIdNumber = await atlasController.findAcademicIdNumber(academicId, studentAMNumber);
    let academicIDNumber = studentAcademicIdNumber.message.AcademicIDNumber; //243761386827
    logger.info(academicIDNumber);

    let registeredStudent = await atlasController.getRegisteredStudent(academicIDNumber);
    logger.info(registeredStudent);

    let registerResult;
    // the below line is possibly the right one; gets academicId from AM and department id
    // let registeredStudent = await atlasController.findAcademicIdNumber(academicId, studentAMNumber);
    if (registeredStudent.message != null) {
      logger.info('user is registered');
      // logger.info(registeredStudent.message.AcademicIDNumber);
    } else {
      logger.info('not a registered user');
      // Student SHOULD sign up on this occassion
      registerResult = await atlasController.registerNewStudent(academicIDNumber);
      logger.info(registerResult);
    }
    // logger.info(registeredStudent);

    // TO BE TESTED
    // const preassignResult = await companyService.getPreassignModeByDepartmentId(98);
    // logger.info(preassignResult.preassign);
    logger.info(assignmentData.position_id);
    let positionPreassignment = await atlasController.getPositionPreassignment(assignmentData.position_id, academicId);
    logger.info(positionPreassignment);

    // const fundingType = await atlasController.getFundingType(assignmentData.position_id);
    // logger.info(fundingType);

    const studentToAssignID = registeredStudent?.message?.ID || registerResult?.message?.ID;

    try {
      logger.info("be4 final assign of student");
      // assign student to Atlas position
      let assignResults = await atlasController.assignStudent(positionPreassignment, studentToAssignID, isTEIProgramOfStudy, implementationDates);
      logger.info("after final assign of student");
      // If assignment fails, throw an error displaying the message
      if (assignResults.status == "400 bad request") {
        logger.error(assignResults.message);
        throw new Error(assignResults.message);
      }
      // If assignment fails for business reason, throw an error displaying the message
      if (!assignResults.message.Success) {
        logger.error("atlas assign failed: " + assignResults.message.Message);
        throw new Error(assignResults.message.Message);
      }

      logger.info(assignResults);
    } catch (error) {
      logger.error(error.message);
      response.status(500)
        .json({
          message: error.message
        });
      return;
    }

    // update assignment details - local db
    await studentService.acceptAssignment(assignmentData, positionPreassignment?.positionIds[0]);

    logger.info('successful final assignment for student ' + studentId);
    response.status(201)
      .json({
        message: "assignment was inserted successfully"
      });
  } catch (error) {
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const insertOrUpdateDepartmentDetails = async (request, response) => {
  const studentId = request.params.id;
  const studentData = request.body.data;
  logger.info(request.body);
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

    logger.info(body);
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
    logger.info(error);
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
    //logger.info(`Student's ranked approval status for period ${periodId} has been successfully retrieved.`);
    response.status(200).json(approvalState);
  } catch (error) {
    logger.info(`Student's ranked approval status for period ${periodId} has NOT been retrieved.`);
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
    logger.info("produceContractFile");
    const studentId = request.params.id;
    const docType = request.body.doctype;
    const periodId = request.body.periodId;
    const departmentId = request.body.departmentId;

    let metadata = await studentService.getContractFileMetadataByStudentId(studentId, periodId);
    logger.info(metadata);

    // The separation of old and new contracts/payment orders - due to changes in the NSRF (MIS, logo, texts, etc.)
    // Old files (_old) cover 2022-2023 contracts; from 2023 onwards contracts are covered by the new files
    const yearFound = await studentService.isOldContractForStudentAndPeriod(studentId, periodId);
    logger.info(yearFound);

    // Find the contract that matches yearFound
    const contractFound = studentService.getAllContractsFromEnv(yearFound);

    // Define paths for AEI and TEI contracts based on old or new contracts status
    const fileDirAEI = contractFound ? contractFound.path : process.env.CONTRACT_FILE_PATH_AEI_old;
    const fileDirTEI = contractFound ? process.env.CONTRACT_FILE_PATH_TEI : process.env.CONTRACT_FILE_PATH_TEI_old;

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
      COMPANY_NAME: metadata.asgmt_company_name || metadata.company_name,
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
      APOFASI: metadata.assignment_apofasi ?? metadata.apofasi ?? "……………………………………………...",
      ARITHMOS_SUNEDRIASHS: metadata.assignment_arithmos_sunedriashs ?? metadata.arithmos_sunedriashs ?? "……………………………………………...",
      APOFASI_ADA_NUMBER: metadata.assignment_ada_number ?? metadata.ada_number ?? "………..",
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
    logger.error(error.message);
    response.status(401).json({
      message: error.message
    });
  }
};

const produceCompletionCertificateFile = async (req, res) => {
  try {
    logger.info("produceCompletionCertificateFile endpoint called");

    const { doctype, data: metadata } = req.body;
    logger.info(req.body);
    // Define the path to the .docx template file
    const fileDir = process.env.COMPLETION_CERT_FILE_PATH || "./word-contract-templates/ΒΕΒΑΙΩΣΗ_ΟΛΟΚΛΗΡΩΣΗΣ_ΠΑ2025.docx";
    logger.info(fileDir);
    // Load the .docx file as binary content
    const content = fs.readFileSync(path.resolve(fileDir), "binary");
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    logger.info(metadata);
    // Define the replacements for placeholders
    doc.render({
      STUDENT_NAME: metadata.student_name || "………………",
      DEPARTMENT: metadata.department || "………………",
      UNIVERSITY: metadata.university || "………………",
      STUDENT_ID: metadata.AM || "………………",
      POSITION_ID: metadata.position_id || "………………",
      INTERNSHIP_SUBJECT: metadata.internshipSubject || "………………",
      START_DATE: metadata.start_date || "………………",
      END_DATE: metadata.end_date || "………………",
      COMPANY: metadata.company || "………………",
      DEPARTMENT_MANAGER: metadata.department_manager || "………………",
      DATE_NOW: moment().format("DD/MM/YYYY"),
      FATHER_NAME: metadata.father_name || "………………"
    });

    // Generate the output document as a buffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Define a file name for the output document
    const fileName = `student_${metadata.studentName || "unknown"}_COMPLETION.docx`;

    // Set headers to prompt the client to download the file
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${fileName}`,
    });

    // Send the document buffer as a response
    res.send(buf);

  } catch (error) {
    logger.error("Error generating completion certificate:", error.message);
    res.status(500).json({
      message: "An error occurred while generating the certificate.",
      error: error.message,
    });
  }
};

const producePaymentOrderFile = async (request, response) => {
  try {
    logger.info("producePaymentOrderFile");
    const studentId = request.params.id;
    const docType = request.body.doctype;
    const periodId = request.body.periodId;
    const departmentId = request.body.departmentId;

    let metadata = await studentService.getPaymentOrderMetadataByStudentId(studentId, periodId);
    logger.info(metadata);

    // The separation of old and new contracts/payment orders - due to changes in the NSRF (MIS, logo, texts, etc.)
    // Old files (_old) cover 2022-2023 contracts; from 2023 onwards contracts are covered by the new files
    const yearFound = await studentService.isOldContractForStudentAndPeriod(studentId, periodId);

    // Find the contract that matches yearFound
    const paymentOrderFound = studentService.getAllPaymentOrdersFromEnv(yearFound);

    // Define path for payment order based on old or new contracts status
    const fileDir = paymentOrderFound ? paymentOrderFound.path : process.env.PAYMENT_ORDER_FILE_PATH_old;

    // Load the docx file as binary content
    let content = fs.readFileSync(
      path.resolve(fileDir),
      "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace placeholders {first_name} by John etc.)
    doc.render({
      CONTRACT_DATE: !metadata.contract_date ? "………………" : moment(metadata.contract_date).format('DD/MM/YYYY'),
      STUDENT_NAME: metadata.displayname,
      // STUDENT_FATHER_NAME: metadata.father_name,
      STUDENT_PRONOUN: !(metadata?.student_gender) ? 'O/H' : (metadata?.student_gender == '1' ? 'Ο' : 'Η'),
      STUDENT_PRONOUN2: !(metadata?.student_gender) ? 'ΤOΥ/ΤHΣ' : (metadata?.student_gender == '1' ? 'ΤΟΥ' : 'ΤΗΣ'),
      DEPT_NAME: metadata.dept_name,
      TY_NAME: metadata.department_manager_name,
      TY_PRONOUN: !(metadata?.department_manager_gender) ? 'O/H Τμηματικός Υπεύθυνος/η' : (metadata?.department_manager_gender == '1' ? 'Ο Τμηματικός Υπεύθυνος' : 'Η Τμηματική Υπεύθυνη'),
      PA_START_DATE: moment(metadata.pa_start_date).format('DD/MM/YYYY'),
      PA_END_DATE: moment(metadata.pa_end_date).format('DD/MM/YYYY'),
      APOFASI: metadata.assignment_apofasi ?? metadata.apofasi ?? "……………………………………………...",
      ARITHMOS_SUNEDRIASHS: metadata.assignment_arithmos_sunedriashs ?? metadata.arithmos_sunedriashs ?? "……………………………………………...",
      APOFASI_ADA_NUMBER: metadata.assignment_ada_number ?? metadata.ada_number ?? "………..",
      STUDENT_WAGES: !metadata.student_wages ? "……………… " : metadata.student_wages,
      CURR_DATE: moment().format('DD/MM/YYYY')
    });

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    const fileName = "student" + studentId + "_PAYMENTORDER.docx";
    const filePath = `../uploads/payments/${studentId}`;

    // Make a folder if not exists
    fs.mkdirSync(filePath, { recursive: true });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    fs.writeFileSync(path.resolve(filePath, fileName), buf);

    response
      .status(200)
      .sendFile(path.resolve(filePath, fileName), buf);

  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
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
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getContractDetailsByDepartmentAndPeriod = async (request, response) => {
  try {
    const departmentId = request.query.departmentId;
    const periodId = request.query.periodId;

    const contractDetails = await studentService.getContractDetailsByDepartmentAndPeriod(departmentId, periodId);

    response.status(200).json(contractDetails);
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const updatePaymentOrderDetails = async (request, response) => {
  try {
    const studentId = request.params.id;
    const periodId = request.body.periodId;
    const paymentOrderInfo = request.body.contract;

    await studentService.updatePaymentOrderDetails(studentId, periodId, paymentOrderInfo);

    response.status(200).json({
      message: "Payment Order Details were updated successfully"
    });
  } catch (error) {
    logger.error(error.message);
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
    logger.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

const isEntrySheetEnabledForStudent = async (request, response) => {
  try {
    const studentId = request.query.studentId;

    const areSheetsEnabledForStudent = await studentService.isEntrySheetEnabledForStudent(studentId);

    response.status(200).json(areSheetsEnabledForStudent);
  } catch (error) {
    logger.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

const isExitSheetEnabledForStudent = async (request, response) => {
  try {
    const studentId = request.query.studentId;

    const areSheetsEnabledForStudent = await studentService.isExitSheetEnabledForStudent(studentId);

    response.status(200).json(areSheetsEnabledForStudent);
  } catch (error) {
    logger.error(error.message);
    response.status(404).send({
      message: error.message
    });
  }
};

const updateAssignmentStateByStudentAndPosition = async (request, response) => {
  try {
    const studentId = request.params.id;
    const { positionId, periodId } = request.body;
    logger.info(request.body);

    await studentService.updateAssignmentStateByStudentAndPosition(studentId, periodId, positionId);
    response.status(200).send({
      message: "Student assignment status updated successfully"
    });
  } catch (error) {
    logger.error(error.message);
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
  getStudentEvaluationSheetsQuestions,
  getStudentPositions,
  getStudentApplications,
  getStudentActiveApplication,
  getPhase,
  getCommentByStudentIdAndSubject,
  getAssignmentsByStudentId,
  getStudentRankedApprovalStatusForPeriod,
  getContractDetailsByStudentIdAndPeriod,
  getContractDetailsByDepartmentAndPeriod,
  getLatestPeriodOfStudent,
  getStudentContractStatus,
  produceEvaluationFormFile,
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
  updatePaymentOrderDetails,
  updateAssignmentStateByStudentAndPosition,
  deleteEntryFormByStudentId,
  deletePositionsByStudentId,
  deleteApplicationById,
  //dummy login
  login,
  insertSSNFile,
  insertIbanFile,
  insertAMEAFile,
  insertAffidavitFile,
  insertStudentResignAppFile,
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
  produceContractFile,
  producePaymentOrderFile,
  produceCompletionCertificateFile,
  isEntrySheetEnabledForStudent,
  isExitSheetEnabledForStudent
};
