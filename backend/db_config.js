const Pool = require("pg").Pool;

// connection details
const pool = new Pool({
  user: "postgres",
  password: "root",
  database: "internship_db",
  host: "localhost",
  port: 5432
});

module.exports = pool;
