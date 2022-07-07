// database connection configuration
const pool = require("../db_config.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const MiscUtils = require("../MiscUtils.js");

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

const getStudentsApplyPhase = async (deptId) => {
  try {
    const students = await pool.query("SELECT * FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND student_users.phase <> '0' \
                                      AND sso_users.department_id = $1", [deptId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students from phase 1 for this department');
  }
};

const getStudentsPhase2 = async (deptId) => {
  try {
    const students = await pool.query("SELECT * FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND sso_users.department_id = $1 \
                                      AND student_users.phase = '2' ", [deptId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students from phase 2 for this department');
  }
};

const getRankedStudentsByDeptId = async (deptId) => {
  try {
    const students = await pool.query("SELECT * FROM students_approved_rank \
                                      INNER JOIN sso_users \
                                      ON students_approved_rank.sso_uid = sso_users.uuid \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      WHERE sso_users.department_id = $1", [deptId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students from phase 2 for this department');
  }
};

const getStudentActiveApplications = async (deptId) => {
  try {
    const applications = await pool.query("SELECT * FROM active_applications \
                                      WHERE department_id = $1", [deptId]);
    return applications.rows;
  } catch (error) {
    throw Error('Error while fetching student active applications');
  }
};

const splitScholarsPersonalData = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 2];
};

const splitStudentsAM = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 1];
};

const insertPeriod = async (body, id) => {
  try {
    await deactivateAllPeriods();
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

const insertApprovedStudentsRank = async (departmentId, genericPeriod) => {
  const STUDENT_SELECTION_PHASE = 2;
  try {
    if (genericPeriod < STUDENT_SELECTION_PHASE) {
      return;
    }
    const getStudentsPhase = await getStudentsPhase2(departmentId);
    await deleteApprovedStudentsRank(departmentId);
    let i = 1;
    for (students of getStudentsPhase) {
      const procedureResults = await getStudentFactorProcedure(MiscUtils.departmentsMap[students.department_id], splitStudentsAM(students.schacpersonaluniquecode));
      // console.log(procedureResults.Grade + " | " + MiscUtils.departmentsMap[students.department_id]);
      let calculatedScore = 0;
      if (procedureResults.Grade == null || procedureResults.Ects == null || procedureResults.Semester == null || procedureResults.Praktiki == null) {
        console.error("some student details fetched from procedure were null");
        //continue;
      } else {
        calculatedScore = calculateScore(procedureResults);
      }
      await pool.query("INSERT INTO students_approved_rank " +
        "(sso_uid, department_id, score, ranking)" +
        " VALUES " + "($1, $2, $3, $4)",
        [students.sso_uid, departmentId, calculatedScore, i++]);
    }
  } catch (error) {
    console.log('Error while inserting Approved students rank ' + error.message);
    throw Error('Error while inserting Approved students rank');
  }
};

const calculateScore = (procedureResults) => {
  const ECTS_PER_SEMESTER = 30;
  // all weights sum must be equal to 1
  const weightGrade = 0.6;
  const weightSemester = 0.4;
  let semesterLimited = (procedureResults.Semester > 14) ? 14 : procedureResults.Semester;
  return ((procedureResults.Grade * weightGrade) + ((procedureResults.Ects / (semesterLimited * ECTS_PER_SEMESTER) * 10) * weightSemester)).toFixed(3);
};

const getStudentFactorProcedure = async (depId, studentAM) => {
  try {
    //console.log(mssql);
    // make sure that any items are correctly URL encoded in the connection string
    let mspool = await msql.connect(mssql);

    const result = await mspool.request()
      .input('DepId', msql.Int, depId)
      .input('am', msql.VarChar(100), studentAM)
      .execute('usp_GetStudentFactorPraktiki');
    //console.log(result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    // error checks
    console.log("error: " + error);
  }
};

const deactivateAllPeriods = async () => {
  try {
    const insertResults = await pool.query("UPDATE period \
                                            SET is_active = 'false'");
    return insertResults;
  } catch (error) {
    throw Error('Error while deactivating periods');
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
      AND is_active = 'true' \
      LIMIT 1", [id]);
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period');
  }
};


const updatePhaseByStudentId = async (phase, studentId) => {
  try {
    const insertResults = await pool.query("UPDATE student_users \
                                            SET phase = $1 WHERE sso_uid = $2 ", [phase, studentId]);
    return insertResults;
  } catch (error) {
    console.log('Error while updating students phase' + error.message);
    throw Error('Error while updating students phase');
  }
};

const deletePeriodById = async (id) => {
  try {
    await pool.query("UPDATE period \
                      SET is_active = 'false' \
                      WHERE id = $1", [id]);
  } catch (error) {
    console.log('Error while deleting period ' + error.message);
    throw Error('Error while deleting period');
  }
};

const deleteApprovedStudentsRank = async (departmentId) => {
  try {
    await pool.query("DELETE FROM students_approved_rank WHERE department_id = $1 ", [departmentId]);
  } catch (error) {
    console.log('Error while deleting approved students ' + error.message);
    throw Error('Error while deleting approved students');
  }
};

const deleteRankingByStudentId = async (departmentId) => {
  try {
    const deleteResults = await pool.query("DELETE FROM students_approved_rank WHERE department_id = $1", [departmentId]);
    return deleteResults;
  } catch (error) {
    throw Error(`Error while deleting students approved rank ( department_id: ${departmentId} )`);
  }
};

const updateStudentRanking = async (department_id, body) => {
  try {
    await deleteRankingByStudentId(department_id);
    for (let i = 0; i < body.length; i++) {
      await insertRankingPositions(department_id, body[i]);
    }
  } catch (error) {
    throw Error('Error while updating student positions');
  }
};

const insertRankingPositions = async (department_id, body) => {
  try {
    // console.log(body);
    await pool.query("INSERT INTO students_approved_rank (sso_uid, department_id, score, ranking) " +
      " VALUES" +
      " ($1, $2, $3, $4) ",
      [body.uuid, department_id, body.score, body.ranking]);
  } catch (error) {
    throw Error('Error while inserting students approved rank');
  }
};

module.exports = {
  getDepManagerById,
  getDepartmentNameByNumber,
  getPeriodByUserId,
  getStudentsApplyPhase,
  getRankedStudentsByDeptId,
  getStudentActiveApplications,
  insertPeriod,
  insertApprovedStudentsRank,
  updatePeriodById,
  updatePhaseByStudentId,
  updateStudentRanking,
  deletePeriodById
};
