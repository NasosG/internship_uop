// database connection configuration
const pool = require("../db_config.js");

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


module.exports = {
  getPeriodByDepartmentId,
};
