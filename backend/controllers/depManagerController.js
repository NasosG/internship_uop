const depManagerService = require("../services/depManagerService.js");

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

// TODO test and make it work
const insertPeriod = async (request, response, next) => {
  try {
    const id = request.params.id;
    const period = request.body;
    const insertResults = await depManagerService.insertPeriod(period, id);

    response
      .status(201)
      .json({
        message: 'Period inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

module.exports = {
  getDepManagerById,
  insertPeriod
};
