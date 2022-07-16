const officeService = require("../services/officeService.js");

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
  getPeriodByDepartmentId
};
