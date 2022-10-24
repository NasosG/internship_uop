const officeService = require("../services/officeService.js");
const jwt = require("jsonwebtoken");

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await officeService.login(uname);

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

const getOfficeUserById = async (request, response) => {
  try {
    const id = request.params.id;
    const users = await officeService.getDepManagerById(id);
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

const insertEspaPosition = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const data = request.body;
    // await officeService.insertEspaPosition(data, departmentId);
    await officeService.insertOrUpdateEspaPositionsByDepId(data, departmentId);
    response
      .status(201)
      .json({
        message: 'espa positions inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};


module.exports = {
  getPeriodByDepartmentId,
  getOfficeUserById,
  insertEspaPosition,
  login
};
