const officeService = require("../services/officeService.js");

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

module.exports = {
  getPeriodByDepartmentId,
  getOfficeUserById
};
