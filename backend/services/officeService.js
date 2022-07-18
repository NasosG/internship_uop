// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");

const getDepManagerById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users WHERE uuid=$1", [id]);
    const finalDepManagerResults = resultsSSOUsers.rows[0];
    const departmentNumber = MiscUtils.splitScholarsPersonalData(finalDepManagerResults.schacpersonaluniquecode);
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

const getPeriodByDepartmentId = async (departmentId) => {
  try {
    const period = await pool.query("SELECT id, sso_user_id, available_positions, pyear, semester, phase_state, \
      to_char(\"date_from\", 'YYYY-MM-DD') as date_from, to_char(\"date_to\", 'YYYY-MM-DD') as date_to FROM period \
      WHERE department_id = $1 \
      AND is_active = 'true' \
      LIMIT 1", [departmentId]);
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period');
  }
};

const insertEspaPosition = async (body, departmentId) => {
  try {
    const positions = await pool.query("INSERT INTO espa_positions" +
      "(department_id, positions)" +
      " VALUES ($1, $2)",
      [departmentId, body.positions]);
  } catch (error) {
    console.log('Error while inserting espa positions ' + error.message);
    throw Error('Error while inserting espa positions');
  }
};

const upateEspaPosition = async (body, departmentId) => {
  try {
    const positions = await pool.query("UPDATE espa_positions SET positions = $1 WHERE department_id = $2",
      [body.positions, departmentId]);
  } catch (error) {
    console.log('Error while updating espa positions ' + error.message);
    throw Error('Error while updating espa positions');
  }
};

const getEspaPositionByDepId = async (departmentId) => {
  try {
    const positions = await pool.query("SELECT * FROM espa_positions WHERE department_id = $1",
      [departmentId]);
    return positions;
  } catch (error) {
    console.log('Error while getting espa positions by id ' + error.message);
    throw Error('Error while getting espa positions by id');
  }
};

const insertOrUpdateEspaPositionsByDepId = async (body, departmentId) => {
  try {
    const fechedEspaPositions = await getEspaPositionByDepId(departmentId)
    if (fechedEspaPositions.rowCount == 0) {
      await insertEspaPosition(body, departmentId);
    } else {
      await upateEspaPosition(body, departmentId);
    }
  } catch (error) {
    throw Error('Error while inserting or updating espa positions')
  }
}

module.exports = {
  getPeriodByDepartmentId,
  getDepManagerById,
  getEspaPositionByDepId,
  insertOrUpdateEspaPositionsByDepId
};
