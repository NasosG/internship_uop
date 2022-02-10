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

module.exports = {
  getStudents
};
