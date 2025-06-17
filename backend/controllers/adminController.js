const jwt = require("jsonwebtoken");
const adminService = require("../services/adminService.js");
// Logging
const logger = require('../config/logger');
// Mailer
const mainMailer = require('../mailers/mainMailers.js');

const login = async (request, response) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await adminService.loginAdmin(uname);

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

const insertRoles = async (request, response) => {
  try {
    const username = request.body.username;
    const role = request.body.user_role;
    const isAdmin = request.body.is_admin;
    const academics = request.body.academics;

    const userRole = await adminService.insertRoles(username, role, isAdmin, academics);

    response.status(201).json({ message: 'Successfully inserted user role' });
  } catch (error) {
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getUsers = async (request, response) => {
  try {
    const users = await adminService.getUsersWithRoles();
    response.status(200).json(users);
  } catch (error) {
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getDepartmentsOfUserByUserID = async (request, response) => {
  try {
    const userRoleId = request.params.id;
    logger.info(userRoleId);
    const departments = await adminService.getDepartmentsOfUserByUserID(userRoleId);
    response.status(200).json(departments);
  } catch (error) {
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const deleteUserRoleByUserId = async (request, response) => {
  try {
    const userRoleId = request.params.id;
    await adminService.deleteUserRoleByUserId(userRoleId);
    response.status(200)
      .json({
        message: "User role was successfully deleted"
      });
  } catch (error) {
    logger.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getStudentsWithoutSheets = async (request, response) => {
  const departmentId = Number(request.params.departmentId);
  const { type } = request.query;

  if (isNaN(departmentId)) {
    return response.status(400).json({ error: "Invalid department ID" });
  }

  try {
    const students = await adminService.getStudentsWithoutSheets(departmentId, type);
    response.json(students);
  } catch (error) {
    console.error("Error fetching students without sheets:", error);
    response.status(500)
      .json({ 
        error: "Internal server error" 
      });
  }
};

const sendSheetReminders = async (request, response) => {
  try {
    const departmentId = request.params.departmentId;
    const { type, studentMails: studentsMailList } = request.body;

    // Validation
    if (!type || !Array.isArray(studentsMailList) || studentsMailList.length === 0) {
      return res.status(400).json({ message: "Missing type or studentMails in request body." });
    }

    await mainMailer.sendSheetsReminderEmail(studentMailsList);

    response.status(200)
      .json({ 
        message: "Reminders sent successfully." 
      });
  } catch (error) {
    logger.error("Error sending reminders:", error);
    response.status(500)
      .json({ 
        message: "Error sending reminders: " + error.message 
      });
  }
};


module.exports = {
  login,
  getUsers,
  getDepartmentsOfUserByUserID,
  getStudentsWithoutSheets,
  sendSheetReminders,
  deleteUserRoleByUserId,
  insertRoles
};
