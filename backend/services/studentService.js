// database connection configuration
const pool = require("../db_config.js");

const getStudents = async (request, response) => {
  try {
    const results = await pool.query("SELECT sn, givenname FROM sso_users ");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
  }
};

const getLoginStudent = async (request, response) => {
  try {
    const results = await pool.query("SELECT sn, givenname FROM sso_users LIMIT 1");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  getStudents,
  getLoginStudent
};
