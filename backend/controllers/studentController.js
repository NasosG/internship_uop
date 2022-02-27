const studentService = require("../services/studentService.js");

/**
 * Returns all students from SSO and student users tables.
 */
const getStudents = async (request, response) => {
  try {
    const users = await studentService.getStudents();
    response.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    response.send({
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
    console.error(error.message);
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
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentDetails(student, id);
    // console.log(inserts.rowCount);
    response
      .status(200)
      .json({
        message: 'Student details updated successfully'
      });
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
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
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
}

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
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
}

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
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
}

const deleteEntryFormByStudentId = async (request, response) => {
  const id = request.params.id;
  try {
    const results = await studentService.deleteEntryFormByStudentId(id);
    response
      .status(200)
      .send(`entry form of student with ID: ${id} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

module.exports = {
  getStudents,
  getStudentEntrySheets,
  getStudentExitSheets,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentEntrySheet,
  insertStudentEntrySheet,
  insertStudentExitSheet,
  deleteEntryFormByStudentId
};

// const updateStudentSSNFile = async (req, res) => {
//   console.log('FILE ADDED');
// };
