const officeService = require("../services/officeService.js");
const jwt = require("jsonwebtoken");
// Logging
const logger = require('../config/logger');

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await officeService.login(uname);

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

const getOfficeUserById = async (request, response) => {
  try {
    const id = request.params.id;
    const users = await officeService.getOfficeUserById(id);
    response.status(200).json(users);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getPeriodByDepartmentId = async (request, response) => {
  try {
    const id = request.params.id;
    const period = await officeService.getPeriodByDepartmentId(id);
    response.status(200).json(period);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getStudentsWithSheetInput = async (request, response) => {
  try {
    const periodId = request.params.period_id;

    const users = await officeService.getStudentsWithSheetInput(periodId);
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
    const users = await officeService.getStudentsWithSheetOutput(periodId);
    response.status(200).json(users);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getAchievementsStats = async (request, response) => {
  try {
    const stats = await officeService.getAchievementsStats();
    response.status(200).json(stats);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getAchievementsStatsForStudents = async (request, response) => {
  try {
    const stats = await officeService.getAchievementsStatsForStudents();
    response.status(200).json(stats);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const getAchievementsYearlyStatsForStudents = async (request, response) => {
  try {
    const year = request.params.year;
    const stats = await officeService.getAchievementsYearlyStatsForStudents(year);
    response.status(200).json(stats);
  } catch (error) {
    response.status(404).json({
      message: error.message
    });
  }
};

const insertEspaPosition = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const data = request.body;

    await officeService.insertOrUpdateEspaPositionsByDepId(data, departmentId);
    response
      .status(201)
      .json({
        message: 'espa positions inserted successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getAcademicsByOfficeUserId = async (request, response) => {
  try {
    const officeUserId = request.params.id;
    const academics = await officeService.getAcademicsByOfficeUserId(officeUserId);
    response.status(200).json(academics);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const updateEntrySheetField = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    await officeService.updateEntrySheetField(id, data);

    response
      .status(201)
      .json({
        message: 'entry sheet field updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response
      .status(400)
      .send({
        message: error.message
      });
  }
};

const updateExitSheetField = async (request, response) => {
  try {
    const id = request.params.id;
    const data = request.body;
    await officeService.updateExitSheetField(id, data);

    response
      .status(201)
      .json({
        message: 'entry sheet field updated successfully'
      });
  } catch (error) {
    logger.error(error.message);
    response
      .status(400)
      .send({
        message: error.message
      });
  }
};

const getEspaPositionsByDepartmentId = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const positionsArray = await officeService.getEspaPositionByDepId(departmentId);
    const positions = positionsArray.rows[0].positions;
    response.status(200).json(positions);
  } catch (error) {
    logger.error(error.message);
    response
      .status(400)
      .send({
        message: error.message
      });
  };
};

const getStudentListForPeriodAndAcademic = async (request, response) => {
  try {
    const departmentId = request.query.departmentId;
    const periodId = request.query.periodId;

    const studentList = await officeService.getStudentListForPeriodAndAcademic(periodId, departmentId);
    response.status(200).json(studentList);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

const getStudentPaymentsListForPeriodAndAcademic = async (request, response) => {
  try {
    const departmentId = request.query.departmentId;
    const periodId = request.query.periodId;

    const studentList = await officeService.getStudentPaymentsListForPeriodAndAcademic(periodId, departmentId);
    response.status(200).json(studentList);
  } catch (error) {
    logger.error(error.message);
    response.status(400)
      .json({
        message: error.message
      });
  }
};

module.exports = {
  getPeriodByDepartmentId,
  getOfficeUserById,
  getStudentsWithSheetInput,
  getStudentsWithSheetOutput,
  getAcademicsByOfficeUserId,
  getEspaPositionsByDepartmentId,
  getStudentListForPeriodAndAcademic,
  getStudentPaymentsListForPeriodAndAcademic,
  getAchievementsStats,
  getAchievementsStatsForStudents,
  getAchievementsYearlyStatsForStudents,
  insertEspaPosition,
  updateEntrySheetField,
  updateExitSheetField,
  login
};
