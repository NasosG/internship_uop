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

module.exports = {
  getDepManagerById
};
