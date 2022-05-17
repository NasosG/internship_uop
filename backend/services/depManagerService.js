// database connection configuration
const pool = require("../db_config.js");


const getDepManagerById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users WHERE uuid=$1", [id]);
    const finalDepManagerResults = resultsSSOUsers.rows[0];
    const departmentNumber = splitScholarsPersonalData(finalDepManagerResults.schacpersonaluniquecode);
    const departmentDetails = await getDepartmentNameByNumber(departmentNumber);
    const department = {
      "department": departmentDetails.rows[0].department
    };
    let departmentManagerDetails = Object.assign(finalDepManagerResults, department);
    return departmentManagerDetails;
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

const splitScholarsPersonalData = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 2];
};

const insertPeriod = async (body, id) => {
  try {
    let pyear = body.date_from.split('-')[0];
    const insertResults = await pool.query("INSERT INTO period" +
      "(sso_user_id, available_positions, pyear, semester, phase_state, date_from, date_to, is_active)" +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, 'true')",
      [id, body.available_positions, pyear, body.semester, body.phase_state, body.date_from, body.date_to]);
    return insertResults;
  } catch (error) {
    console.log('Error while inserting period time ' + error.message);
    throw Error('Error while inserting period time');
  }
};

const updatePeriodById = async (body, id) => {
  try {
    console.log(body);
    let pyear = body.date_from.split('-')[0];
    const updateResults = await pool.query("UPDATE period" +
      " SET available_positions = $1, pyear = $2, semester = $3, phase_state = $4, date_from= $5, date_to = $6" +
      " WHERE id = $7",
      [body.available_positions, pyear, body.semester, body.phase_state, body.date_from, body.date_to, id]);
    return updateResults;
  } catch (error) {
    console.log('Error while updating period time ' + error.message);
    throw Error('Error while updating period time');
  }
};

const getPeriodByUserId = async (id) => {
  try {
    const period = await pool.query("SELECT id, sso_user_id, available_positions, pyear, semester, phase_state, \
     to_char(\"date_from\", 'YYYY-MM-DD') as date_from, to_char(\"date_to\", 'YYYY-MM-DD') as date_to FROM period \
      WHERE sso_user_id = $1 \
      ORDER BY id DESC \
      LIMIT 1", [id]);
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period');
  }
};


module.exports = {
  getDepManagerById,
  getDepartmentNameByNumber,
  getPeriodByUserId,
  insertPeriod,
  updatePeriodById
};
