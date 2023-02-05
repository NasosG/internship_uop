const depManagerService = require("../services/depManagerService.js");
const jwt = require("jsonwebtoken");

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await depManagerService.login(uname);

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
    const departmentId = request.params.department_id;
    const users = await depManagerService.getStudentsWithSheetInput(departmentId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getStudentsWithSheetOutput = async (request, response) => {
  try {
    const departmentId = request.params.department_id;
    const users = await depManagerService.getStudentsWithSheetOutput(departmentId);
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
    // const id = request.params.id;
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
    console.error(error.message);
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
    console.error(error.message);
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
      // If different, insert the new phase_state into the phase table
      await depManagerService.insertPhaseOfPeriod(id, parseInt(period.phase_state), period);
    }

    await depManagerService.updatePeriodById(period, id);

    response
      .status(201)
      .json({
        message: 'Period updated successfully'
      });
  } catch (error) {
    console.error(error.message);
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
    console.log(error.message);
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
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updatePhaseByStudentId = async (request, response, next) => {
  try {
    const id = request.params.id;
    const phaseNumber = request.body.phase;

    await depManagerService.updatePhaseByStudentId(phaseNumber, id);

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

const insertCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const subject = "Δικαιολογητικά";

    await depManagerService.insertCommentsByStudentId(id, comments, subject);

    response
      .status(200)
      .json({
        message: 'Student comments inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const subject = "Δικαιολογητικά";

    await depManagerService.updateCommentsByStudentId(id, comments, subject);

    response
      .status(200)
      .json({
        message: 'Student comments updated successfully'
      });
  } catch (error) {
    console.error(error.message);
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
  insertPeriod,
  insertApprovedStudentsRank,
  updatePeriodById,
  updatePhaseByStudentId,
  updateStudentRanking,
  deletePeriodById,
  insertCommentsByStudentId,
  updateCommentsByStudentId,
  getCommentByStudentIdAndSubject,
  getCompletedPeriods,
  getManagedAcademicsByUserId,
  updateDepartmentIdByUserId,
  login,
  getPhasesByPeriodId,
  getRankdedStudentsListByDeptAndPeriodId
};
