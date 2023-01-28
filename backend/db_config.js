require('dotenv').config();
const Pool = require("pg").Pool;

const database = (process.env.ENV !== "PROD") ? "internship_db_test" : "internship_db";

// connection details
const pool = new Pool({
  user: "postgres",
  password: "root",
  database: database,
  host: "localhost",
  port: 5432
});

module.exports = pool;
