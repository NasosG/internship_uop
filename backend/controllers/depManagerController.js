const depManagerService = require("../services/depManagerService.js");
const jwt = require("jsonwebtoken");
const atlasController = require("./atlasController");
const companyService = require("../services/companyService.js");
const studentService = require("../services/studentService.js");
const mainMailer = require('../mailers/mainMailers.js');
const MiscUtils = require("../utils/MiscUtils.js");
// Logging
const logger = require('../config/logger');

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await depManagerService.login(uname);

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

const getDepManagerById = async (request, response) => {
  try {
    const id = request.params.id;
    const users = await depManagerService.getDepManagerById(id);
    response.status(200).json(users);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getStudentsApplyPhase = async (request, response) => {
  try {
    const deptId = request.params.id;
    const users = await depManagerService.getStudentsApplyPhase(deptId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getPeriodByUserId = async (request, response) => {
  try {
    const id = request.params.id;
    const period = await depManagerService.getPeriodByUserId(id);
    response.status(200).json(period);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getPeriodByDepartmentId = async (request, response) => {
  try {
    const department_id = request.params.id;
    const period = await depManagerService.getPeriodByDepartmentId(department_id);
    response.status(200).json(period);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    response.status(statusCode).send({
      message: error.message
    });
  }
};

const getEspaPositionsByDepartmentId = async (request, response) => {
  try {
    const department_id = request.params.id;
    const period = await depManagerService.getEspaPositionsByDepartmentId(department_id);
    response.status(200).json(period);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    response.status(statusCode).send({
      message: error.message
    });
  }
};

const getRankedStudentsByDeptId = async (request, response) => {
  try {
    const deptId = request.query.departmentId;
    const periodId = request.query.periodId;

    const users = await depManagerService.getRankedStudentsByDeptId(deptId, periodId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getStudentActiveApplications = async (request, response) => {
  try {
    const deptId = request.params.id;
    const users = await depManagerService.getStudentActiveApplications(deptId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getStudentsWithSheetInput = async (request, response) => {
  try {
    const periodId = request.params.period_id;
    const users = await depManagerService.getStudentsWithSheetInput(periodId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getStudentsWithSheetOutput = async (request, response) => {
  try {
    const periodId = request.params.period_id;
    const users = await depManagerService.getStudentsWithSheetOutput(periodId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getManagedAcademicsByUserId = async (request, response) => {
  try {
    const userId = request.params.userId;
    const academics = await depManagerService.getManagedAcademicsByUserId(userId);

    response.status(200).json(academics);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const insertPeriod = async (request, response, next) => {
  try {
    const id = request.query.depManagerId;
    const departmentId = request.query.departmentId;
    const period = request.body;
    const PHASE_NUMBER = 1;

    const periodId = await depManagerService.insertPeriod(period, id, departmentId);
    await depManagerService.insertPhaseOfPeriod(periodId, PHASE_NUMBER, period);

    response
      .status(201)
      .json({
        message: 'Period inserted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const insertApprovedStudentsRank = async (request, response, next) => {
  try {
    const departmentId = request.params.id;
    const phase = request.body.phase;
    const periodId = request.body.periodId;

    await depManagerService.insertApprovedStudentsRank(departmentId, phase, periodId);
    response
      .status(201)
      .json({
        message: 'Approved students rank inserted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updatePeriodById = async (request, response, next) => {
  try {
    const id = request.params.id;
    const period = request.body;

    // Fetch current phase_state from the database
    const currentPhaseState = await depManagerService.getPhaseStateByPeriodId(id);

    // Check if the current phase_state is different from the updated phase_state
    if (parseInt(currentPhaseState.phase_state) < parseInt(period.phase_state)) {
      // If different, insert the new phase_state into the phase table if not already exist; else update the phase_state
      const phaseData = await depManagerService.getPhaseOfPeriod(id, period.phase_state);
      if (phaseData) {
        await depManagerService.updatePhaseOfPeriod(id, parseInt(period.phase_state), period);
      } else {
        await depManagerService.insertPhaseOfPeriod(id, parseInt(period.phase_state), period);
      }
    } else {
      // If not different, update the period
      await depManagerService.updatePhaseOfPeriod(id, parseInt(period.phase_state), period);
    }

    await depManagerService.updatePeriodById(period, id);

    response
      .status(201)
      .json({
        message: 'Period updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentRanking = async (request, response) => {
  try {
    const periodId = request.params.id;
    const body = request.body;
    await depManagerService.updateStudentRanking(periodId, body);

    response
      .status(200)
      .json({
        message: 'Student rankings were updated successfully'
      });
  } catch (error) {
    logger.info(error.message);
    response.send({
      message: error.message
    });
  }
};

const deletePeriodById = async (request, response, next) => {
  try {
    const id = request.params.id;
    await depManagerService.deletePeriodById(id);

    response
      .status(201)
      .json({
        message: 'Period deleted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const completePeriodById = async (request, response) => {
  try {
    const periodId = request.params.id;
    const departmentId = request.body.departmentId;

    const data = {
      period_id: periodId,
      department_id: departmentId
    };

    logger.info(data);

    await depManagerService.setPeriodCompleted(data);
    await depManagerService.updateEspaPositionsOnPeriodCompleted(data);

    response
      .status(201)
      .json({
        message: 'Period completed successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updatePhaseByStudentId = async (request, response, next) => {
  try {
    const studentId = request.params.id;
    const phaseNumber = request.body.phase;
    const periodId = request.body.periodId;

    await depManagerService.updatePhaseByStudentId(phaseNumber, studentId, periodId);

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

const insertCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const studentMail = request.body.studentMail;
    const subject = "Δικαιολογητικά";

    await depManagerService.insertCommentsByStudentId(id, comments, subject);
    mainMailer.sendCommentEmail(comments, studentMail).catch(logger.error);

    response
      .status(200)
      .json({
        message: 'Student comments inserted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const studentMail = request.body.studentMail;
    const subject = "Δικαιολογητικά";

    await depManagerService.updateCommentsByStudentId(id, comments, subject);
    mainMailer.sendCommentEmail(comments, studentMail).catch(logger.error);

    response
      .status(200)
      .json({
        message: 'Student comments updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const getCommentByStudentIdAndSubject = async (request, response) => {
  try {
    const id = request.query.studentId;
    const subject = request.query.subject;

    const comment = await depManagerService.getCommentByStudentIdAndSubject(id, subject);
    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getCompletedPeriods = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const period = await depManagerService.getCompletedPeriods(departmentId);
    response.status(200).json(period);
  } catch (error) {
    response.status(404).send({
      message: error.message
    });
  }
};

const updateDepartmentIdByUserId = async (request, response) => {
  const userId = request.params.userId;
  const departmentId = request.body.departmentId;

  try {
    await depManagerService.updateDepartmentIdByUserId(userId, departmentId);
    response.status(200).json({
      message: 'Department id updated successfully'
    });
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

const getPhasesByPeriodId = async (request, response) => {
  const periodId = request.params.periodId;
  try {
    const phases = await depManagerService.getPhasesByPeriodId(periodId);
    response.status(200).json(phases);
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

const getRankdedStudentsListByDeptAndPeriodId = async (request, response) => {
  try {
    const deptId = request.query.departmentId;
    const periodId = request.query.periodId;

    const rankedStudents = await depManagerService.getRankdedStudentsListByDeptAndPeriodId(deptId, periodId);
    response.status(200).json(rankedStudents);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getPositionsByApplicationId = async (request, response) => {
  try {
    const applicationId = request.params.id;
    const positions = await depManagerService.getPositionsByApplicationId(applicationId);

    response.status(200).json(positions);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const receiveFile = async (request, response) => {
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
    const companyData = request.body[0];
    logger.info(companyData);

    let academicId = companyData.department_id;
    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (academicId.toString().length == 6) {
      academicId = MiscUtils.getAEICodeFromDepartmentId(academicId);
    }
    logger.info(academicId);
    // TO BE TESTED
    const preassignResult = await depManagerService.getPreassignModeByDepartmentId(academicId);
    logger.info(preassignResult.preassign);

    // Get preassigned position or make a new preassignment
    let positionPreassignment;
    try {
      positionPreassignment = await atlasController.getPositionPreassignment(companyData.position_id, academicId);

      // If preassignment fails, throw an error displaying the message
      if (positionPreassignment.status == "Error occurred") {
        throw new Error(positionPreassignment.message);
      }

      logger.info(positionPreassignment);
    } catch (error) {
      logger.info(error);
      response.status(500)
        .json({
          message: error.message
        });
      return;
    }

    // insert assignment details to the local db
    await depManagerService.insertAssignment(companyData);

    response.status(201)
      .json({
        message: "company pre-assignment was inserted successfully"
      });
  } catch (error) {
    logger.info("some error");
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const insertFinalAssignment = async (request, response) => {
  try {
    const studentId = request.params.id;
    const positionId = request.body.position_id;
    const implementationDates = request.body.implementationDates;
    let isTEIProgramOfStudy = false;

    const assignmentData = await depManagerService.getAssignmentsByStudentAndPositionId(studentId, positionId);
    logger.info(assignmentData);
    logger.info("in final assign - studentId: " + studentId + " - positionId: " + positionId);

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

    // const preassignResult = await companyService.getPreassignModeByDepartmentId(98);
    // logger.info(preassignResult.preassign);
    logger.info(assignmentData.position_id);
    let positionPreassignment = await atlasController.getPositionPreassignment(assignmentData.position_id, academicId);
    logger.info(positionPreassignment);

    // const fundingType = await atlasController.getFundingType(assignmentData.position_id);
    // logger.info(fundingType);

    const studentToAssignID = registeredStudent?.message?.ID || registerResult?.message?.ID;

    try {
      // assign student to Atlas position
      let assignResults = await atlasController.assignStudent(positionPreassignment, studentToAssignID, isTEIProgramOfStudy, implementationDates);

      // If assignment fails, throw an error displaying the message
      if (assignResults.status == "400 bad request") {
        throw new Error(assignResults.message);
      }
      // If assignment fails for business reason, throw an error displaying the message
      if (!assignResults.message.Success) {
        logger.error("atlas assign failed: " + assignResults.message.Message);
        throw new Error(assignResults.message.Message);
      }

      logger.info(assignResults);
    } catch (error) {
      response.status(500)
        .json({
          message: error.message
        });
      return;
    }

    // If assignment does not exist, insert it - local db
    if (!(await depManagerService.doesAssignmentExist(assignmentData))) {
      await depManagerService.insertAssignment(assignmentData, 1);
    } else {
      // Update assignment details - local db
      await studentService.acceptAssignment(assignmentData, positionPreassignment?.positionIds[0]);
    }

    // TODO: Update assignment implementation dates so as our local DB to be aligned whith ATLAS
    await depManagerService.updateAssignmentImplementationDates(implementationDates, assignmentData);

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

const insertAssignImplementationDates = async (request, response) => {
  try {
    const body = request.body;

    logger.info("in assignment implementation dates");
    await depManagerService.insertAssignImplementationDates(body);

    response.status(201)
      .json({
        message: "assignment implementation dates were inserted successfully"
      });
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getAssignImplementationDates = async (request, response) => {
  try {
    const departmentId = request.query.department_id;
    const periodId = request.query.period_id;

    const assignImplementationDates = await depManagerService.getAssignImplementationDates(departmentId, periodId);

    response.status(200).json(assignImplementationDates);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getPeriodAndDepartmentIdByUserId = async (request, response) => {
  try {
    const id = request.params.id;
    const period = await depManagerService.getPeriodAndDepartmentIdByUserId(id);
    response.status(200).json(period);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getAllPeriodsByDepartmentId = async (request, response) => {
  try {
    logger.info(request.params.id);
    const departmentId = request.params.id;
    const periods = await depManagerService.getAllPeriodsByDepartmentId(departmentId);
    response.status(200).json(periods);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const submitFinalResultsToOffice = async (request, response) => {
  const deptManagerId = request.params.id;
  const data = request.body.data;
  let listId = null;

  try {
    logger.info(data);
    const depManagerDetails = await depManagerService.getDepManagerDetails(data.period_id, deptManagerId);
    let result = await depManagerService.doesListExistForDepartmentAndPeriod(data);
    let listExists = result.listExists;
    logger.info(listExists);

    if (!listExists) {
      listId = await depManagerService.insertToFinalAssignmentsList(data, depManagerDetails);
    } else {
      listId = result.listId;
    }

    logger.info(listId);

    if (!listId) {
      response.status(400).json({
        message: error.message
      });
      return;
    }

    const updateAssignments = await depManagerService.updateStudentFinalAssignments(depManagerDetails, listId, data);
    logger.info(updateAssignments);

    // const updateResults = await depManagerService.updateEspaPositionsOnPeriodCompleted(data, listId);

    // const deactivatePeriod = await depManagerService.setPeriodCompleted(data);

    // logger.info(deactivatePeriod);
    logger.info("List insert action completed");

    response.status(200).json({
      message: 'OK'
    });

  } catch (error) {
    await depManagerService.deleteCreatedList(listId, data.period_id);
    response.status(400).json({
      message: error.message
    });
  }
};

const getStudentListForPeriod = async (request, response) => {
  try {
    const periodId = request.params.id;
    const studentList = await depManagerService.getStudentListForPeriod(periodId);
    response.status(200).json(studentList);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getStudentPaymentsListForPeriod = async (request, response) => {
  try {
    const periodId = request.params.id;
    const studentList = await depManagerService.getStudentPaymentsListForPeriod(periodId);
    response.status(200).json(studentList);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getImplementationDatesByStudentAndPeriod = async (request, response) => {
  try {
    const studentId = request.query.studentId;
    const periodId = request.query.periodId;
    const positionId = request.query.positionId;

    const implementationDates = await depManagerService.getImplementationDatesByStudentAndPeriod(studentId, periodId, positionId);
    response.status(200).json(implementationDates);
  } catch (error) {
    logger.error(error.message);
    response.status(400).json({
      message: error.message
    });
  }
};

const updateImplementationDatesByStudentAndPeriod = async (request, response) => {
  try {
    const studentId = request.params.id;
    const periodId = request.body.periodId;
    const implementationDates = request.body.implementationDates;
    const positionId = request.body.positionId;

    await depManagerService.updateImplementationDatesByStudentAndPeriod(studentId, periodId, implementationDates, positionId);
    response.status(201).json({
      message: 'implementation dates were updated successfully'
    });
  } catch (error) {
    logger.error(error.message);
    response.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  getDepManagerById,
  getPeriodByUserId,
  getPeriodByDepartmentId,
  getStudentsApplyPhase,
  getRankedStudentsByDeptId,
  getStudentActiveApplications,
  getStudentsWithSheetInput,
  getStudentsWithSheetOutput,
  getEspaPositionsByDepartmentId,
  getPeriodAndDepartmentIdByUserId,
  getStudentListForPeriod,
  getStudentPaymentsListForPeriod,
  getAllPeriodsByDepartmentId,
  getImplementationDatesByStudentAndPeriod,
  insertPeriod,
  insertApprovedStudentsRank,
  updatePeriodById,
  updatePhaseByStudentId,
  updateStudentRanking,
  updateImplementationDatesByStudentAndPeriod,
  completePeriodById,
  deletePeriodById,
  insertCommentsByStudentId,
  updateCommentsByStudentId,
  getCommentByStudentIdAndSubject,
  getCompletedPeriods,
  getManagedAcademicsByUserId,
  updateDepartmentIdByUserId,
  login,
  getPhasesByPeriodId,
  getRankdedStudentsListByDeptAndPeriodId,
  getPositionsByApplicationId,
  insertAssignment,
  insertFinalAssignment,
  insertAssignImplementationDates,
  getAssignImplementationDates,
  submitFinalResultsToOffice,
  receiveFile
};
