// database connection configuration
const pool = require("../db_config.js");

const getStudents = async (request, response) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users where id='pcst19003'");
    const resultsStudents = await pool.query("SELECT * FROM student_users where id = '1'")
    // const results3 = [resultsSSOUsers.rows, resultsStudents.rows];
    const finalResults = resultsSSOUsers.rows.concat(resultsStudents.rows);
    // console.log(finalResults);
    response.status(200).json(finalResults);
  } catch (error) {
    console.error(error.message);
  }
};

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const inserts = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4  WHERE id = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

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

    const inserts = await pool.query("UPDATE student_users \
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE id = $4",
      [student.ssn, student.doy, student.iban, id]
    );

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

    const inserts = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4  WHERE id = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

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

    const inserts = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE id = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]
    );

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

module.exports = {
  getStudents,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact
  // addStudentsBio
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
