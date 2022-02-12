// database connection configuration
const pool = require("../db_config.js");

const getStudents = async (request, response) => {
  try {
    const results = await pool.query("SELECT * FROM sso_users where id='pcst19003'");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
  }
};

const addStudentsBio = async (request, response, next) => {
  try {
    const student = request.body;
    console.log(student);

    // const inserts = await pool.query("INSERT INTO student_users \
    // VALUES " + "($1)", [...student]);

    response
      .status(201)
      .json({
        message: 'Post added successfully'
      });
    // response.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};


module.exports = {
  getStudents,
  addStudentsBio
};
