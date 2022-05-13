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

module.exports = {
  getDepManagerById,
  getDepartmentNameByNumber
};
