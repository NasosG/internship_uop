const studentService = require("../services/studentService.js");

/**
 * Returns all students from sso and student users tables.
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

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const inserts = await studentService.updateStudentDetails(student, id);
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

    const inserts = await studentService.updateStudentContractDetails(student, id);

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

    const inserts = await studentService.updateStudentBio(student, id);

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

    const inserts = await studentService.updateStudentContact(student, id);

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

    const inserts = await studentService.updateStudentEntrySheet(student, id);

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
    // console.log(student);
    const inserts = await studentService.insertStudentEntrySheet(student, id);

    response
      .status(200)
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

module.exports = {
  getStudents,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentEntrySheet,
  insertStudentEntrySheet
};


// const addStudentsBio = async (request, response, next) => {
//   try {
//     const student = request.body;
//     // console.log(student);
//     console.log("edo" + student.father_name);

//     const inserts = await pool.query("INSERT INTO student_users \
//      VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)",
//       [
//         student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
//       ]);

//     response
//       .status(201)
//       .json({
//         message: 'Student added successfully'
//       });
//   } catch (error) {
//     console.error(error.message);
//     response.send({
//       message: error.message
//     });
//   }
// };

// const updateStudentSSNFile = async (req, res) => {
//   console.log('FILE ADDED');
// };
