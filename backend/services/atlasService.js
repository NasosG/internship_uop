// database connection configuration
const pool = require("../db_config.js");

const getCredentials = async () => {
  try {
    const results = await pool.query("SELECT * FROM atlas_access limit 1");
    return results.rows[0];
  } catch (error) {
    throw Error('Error while fetching credentials');
  }
};


module.exports = {
  getCredentials
}
