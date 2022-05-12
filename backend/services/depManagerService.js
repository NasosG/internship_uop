// database connection configuration
const pool = require("../db_config.js");


const getDepManagerById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users WHERE uuid=$1", [id]);
    // const results3 = [resultsSSOUsers.rows, resultsStudents.rows];
    const finaldepManagerResults = resultsSSOUsers.rows;
    return finaldepManagerResults;
  } catch (error) {
    throw Error('Error while fetching Department Manager');
  }
};

module.exports = {
  getDepManagerById
};
