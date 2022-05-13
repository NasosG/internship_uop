// database connection configuration
const {
  async
} = require("rxjs");
const pool = require("../db_config.js");


const getDepManagerById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users WHERE uuid=$1", [id]);
    const finalDepManagerResults = resultsSSOUsers.rows[0];
    const departmentNumber = splitScholarsPersonalData(finalDepManagerResults.schacpersonaluniquecode);
    const departmentDetails = await getDepartmentNameByNumber(departmentNumber);
    const department = {
      "department": departmentDetails.rows[0].department
    }
    let departmentManageDetails = Object.assign(finalDepManagerResults, department);
    return departmentManageDetails;
  } catch (error) {
    throw Error('Error while fetching Department Manager');
  }
};

const getDepartmentNameByNumber = async (depNumber) => {
  try {
    const results = await pool.query("SELECT department FROM atlas_academics WHERE atlas_id=$1", [depNumber]);
    return results;
  } catch (error) {
    throw Error('Error while fetching department number results');
  }
};

const splitScholarsPersonalData = (x) => {
  const splitArray = x.split(':');
  return splitArray[splitArray.length - 2];
}


const insertPeriod = async (body, id) => {
  try {
    const insertResults = await pool.query("INSERT INTO period" +
      '(sso_user_id, available_positions, pyear, semester, phase_state, date_from, date_to)' +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7)",
      [body.sso_user_id, body.available_positions, body.pyear, body.semester, body.phase_state, body.date_from, body.date_to]);
    return insertResults;
  } catch (error) {
    console.log('Error while inserting period time' + error.message);
    throw Error('Error while inserting period time');
  }
};

module.exports = {
  getDepManagerById,
  getDepartmentNameByNumber,
  insertPeriod
};
