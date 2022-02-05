const Pool = require("pg").Pool;
// connection details
const pool = new Pool({
  user: "postgres",
  password: "root",
  database: "internship_db",
  host: "localhost",
  port: 5432
});

const getStudents = async (request, response) => {
  try {
    const results = await pool.query("SELECT * FROM sso_users ");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  getStudents
};
