// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");

const login = async (username) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              WHERE sso_users.id=$1", [username]);
    if (resultsSSOUsers.rowCount >= 1) {
      return resultsSSOUsers.rows[0].uuid;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in - user: ' + username);
  }
};

const getOfficeUserById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query(`SELECT sso_users.*, users_roles.is_admin FROM sso_users
                                              INNER JOIN users_roles ON sso_users.id = users_roles.sso_username
                                              WHERE uuid = $1`, [id]);
    const finalDepManagerResults = resultsSSOUsers.rows[0];
    const departmentNumber = finalDepManagerResults.department_id;
    const departmentDetails = await getDepartmentNameByNumber(departmentNumber);
    const department = {
      "department": departmentDetails.rows[0].department
    };
    let departmentManagerDetails = Object.assign(finalDepManagerResults, department);
    return departmentManagerDetails;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while fetching Office User');
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
      to_char(\"date_from\", 'YYYY-MM-DD') as date_from, to_char(\"date_to\", 'YYYY-MM-DD') as date_to, espa_positions.positions as positions \
      FROM period \
      LEFT OUTER JOIN espa_positions ON espa_positions.department_id=period.department_id \
      WHERE period.department_id = $1 \
      AND period.is_active = 'true' \
      LIMIT 1", [departmentId]);
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period');
  }
};

const getStudentsWithSheetInput = async (periodId) => {
  try {
    const students = await pool.query(`SELECT * FROM sso_users
                                      INNER JOIN student_users
                                      ON sso_users.uuid = student_users.sso_uid
                                      INNER JOIN entry_form
                                      ON student_users.sso_uid = entry_form.student_id
                                      INNER JOIN internship_assignment
                                      ON internship_assignment.student_id = sso_users.uuid
                                      WHERE internship_assignment.period_id = $1
                                      AND approval_state = 1`, [periodId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students with input sheet' + error.message);
  }
};

const getStudentsWithSheetOutput = async (periodId) => {
  try {
    const students = await pool.query(`SELECT * FROM sso_users
                                    INNER JOIN student_users
                                    ON sso_users.uuid = student_users.sso_uid
                                    INNER JOIN exit_form
                                    ON student_users.sso_uid = exit_form.student_id
                                    INNER JOIN internship_assignment
                                    ON internship_assignment.student_id = sso_users.uuid
                                    WHERE internship_assignment.period_id = $1
                                    AND approval_state = 1`, [periodId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students with output sheet' + error.message);
  }
};

const getAchievementsStats = async () => {
  try {
    const students = await pool.query(
      `SELECT
        deps.department,
        period.pyear AS year,
        COUNT(DISTINCT distinct_students.student_id) AS total_count,
        SUM(CASE WHEN sso_users.schacgender = 1 THEN 1 ELSE 0 END) AS male_count,
        SUM(CASE WHEN sso_users.schacgender = 2 THEN 1 ELSE 0 END) AS female_count,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS completed_count
      FROM
        (SELECT DISTINCT a1.student_id, a2.period_id, a2.status FROM internship_assignment a1 
          INNER JOIN internship_assignment a2 ON a1.student_id = a2.student_id
          WHERE a2.approval_state <> -1 AND a2.status <> -1) AS distinct_students
        INNER JOIN sso_users ON sso_users.uuid = distinct_students.student_id
        INNER JOIN atlas_academics deps ON deps.atlas_id = sso_users.department_id
        INNER JOIN period ON period.id = distinct_students.period_id
      WHERE distinct_students.status <> -1
      GROUP BY
        deps.department,
        period.pyear`);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students with output sheet' + error.message);
  }
};

const getAchievementsStatsForStudents = async () => {
  try {
    const students = await pool.query(
      `SELECT
          a.student_id,
          a.asgmt_company_name,
          sso_users.displayname AS student_name,
          sso_users.schacgender AS student_gender
      FROM
          internship_assignment a
          INNER JOIN sso_users ON sso_users.uuid = a.student_id
      WHERE
          a.status = 1`);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students with output sheet' + error.message);
  }
};

const getAcademicsByOfficeUserId = async (userId) => {
  try {
    const academics = await pool.query("SELECT academic_id, department FROM sso_users \
                                       INNER JOIN users_roles ON users_roles.sso_username = sso_users.id \
                                       INNER JOIN role_manages_academics rma ON rma.user_role_id = users_roles.user_role_id \
                                       INNER JOIN atlas_academics ON atlas_academics.atlas_id = rma.academic_id \
                                       WHERE sso_users.uuid = $1", [userId]);
    return academics.rows;
  } catch (error) {
    throw Error('Error while fetching academics by office user id' + error.message);
  }
};

const getStudentListForPeriodAndAcademic = async (periodId, departmentId) => {
  try {
    const result = await pool.query(`SELECT * FROM final_assignments_list list
                                    INNER JOIN internship_assignment asn ON asn.list_id = list.list_id
                                    INNER JOIN sso_users usr ON usr.uuid = asn.student_id
                                    INNER JOIN student_users stu ON stu.sso_uid = usr.uuid
                                    WHERE list.period_id = $1 AND list.department_id = $2`, [periodId, departmentId]);
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while fetching student list for period ' + error.message);
  }
};

const getStudentPaymentsListForPeriodAndAcademic = async (periodId, departmentId) => {
  try {
    const result = await pool.query(`SELECT list.*, asn.*, usr.*, stu.*, exit_form.ops_number_exodou
                                    FROM final_assignments_list list
                                    INNER JOIN internship_assignment asn ON asn.list_id = list.list_id
                                    INNER JOIN sso_users usr ON usr.uuid = asn.student_id
                                    INNER JOIN student_users stu ON stu.sso_uid = usr.uuid
                                    INNER JOIN exit_form ON stu.sso_uid = exit_form.student_id
                                    WHERE list.period_id = $1 AND list.department_id = $2`, [periodId, departmentId]);
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while fetching student list (payment orders) for period ' + error.message);
  }
};

const insertEspaPosition = async (body, departmentId) => {
  try {
    const positions = await pool.query("INSERT INTO espa_positions" +
      "(department_id, positions)" +
      " VALUES ($1, $2)",
      [departmentId, body.positions]);
  } catch (error) {
    console.log('Error while inserting espa positions ' + error.message + "|" + departmentId);
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
    const fechedEspaPositions = await getEspaPositionByDepId(departmentId);
    if (fechedEspaPositions.rowCount == 0) {
      await insertEspaPosition(body, departmentId);
    } else {
      await upateEspaPosition(body, departmentId);
    }
  } catch (error) {
    throw Error('Error while inserting or updating espa positions');
  }
};

const updateEntrySheetField = async (id, body) => {
  try {
    await pool.query('UPDATE entry_form SET "' + body.fieldId + '" = $1 WHERE id = $2',
      [body.elementValue, id]);

  } catch (error) {
    console.log('Error while updating entry sheet field ' + error.message);
    throw Error('Error while updating entry sheet field');
  }
};

const updateExitSheetField = async (id, body) => {
  try {
    await pool.query('UPDATE exit_form SET "' + body.fieldId + '" = $1 WHERE exit_id = $2',
      [body.elementValue, id]);
  } catch (error) {
    console.log('Error while updating entry sheet field ' + error.message);
    throw Error('Error while updating entry sheet field');
  }
};


module.exports = {
  getPeriodByDepartmentId,
  getOfficeUserById,
  getEspaPositionByDepId,
  getStudentsWithSheetInput,
  getStudentsWithSheetOutput,
  getAcademicsByOfficeUserId,
  getStudentListForPeriodAndAcademic,
  getStudentPaymentsListForPeriodAndAcademic,
  getAchievementsStats,
  getAchievementsStatsForStudents,
  insertOrUpdateEspaPositionsByDepId,
  updateEntrySheetField,
  updateExitSheetField,
  login
};
