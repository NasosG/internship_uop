// database connection configuration
const pool = require("../config/db_config.js");
const mssql = require("../config/secretariat_db_config.js");
const msql = require('mssql');
const MiscUtils = require("../utils/MiscUtils.js");
const atlasService = require("./atlasService.js");
const moment = require('moment');
// Logging
const logger = require('../config/logger');

const login = async (username) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              WHERE sso_users.id = $1", [username]);
    if (resultsSSOUsers.rowCount >= 1) {
      return resultsSSOUsers.rows[0].uuid;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in - user: ' + username);
  }
};

const getDepManagerById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                  INNER JOIN users_roles ON users_roles.sso_username = sso_users.id \
                                  WHERE users_roles.user_role = 'department-manager' \
                                  AND uuid=$1", [id]);
    const finalDepManagerResults = resultsSSOUsers.rows[0];
    const departmentNumber = finalDepManagerResults.department_id;
    const departmentDetails = await getDepartmentNameByNumber(departmentNumber);
    const department = {
      "department": departmentDetails.rows[0].department
    };
    let departmentManagerDetails = Object.assign(finalDepManagerResults, department);
    return departmentManagerDetails;
  } catch (error) {
    throw Error('Error while fetching Department Manager' + error.message);
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
    const students = await pool.query("SELECT sso_users.*, student_users.*, \
                                              atlas_academics.department, \
                                              mergerel.is_study_program_upgraded, \
                                              mergerel.current_study_program, \
                                              apps.protocol_number as latest_app_protocol_number \
                                      FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN semester_interest_apps apps ON apps.student_id = sso_users.uuid \
                                      INNER JOIN period ON period.id = apps.period_id AND period.is_active = true \
                                      INNER JOIN atlas_academics \
                                      ON atlas_academics.atlas_id = sso_users.department_id \
                                      LEFT JOIN merged_departments_rel mergerel \
                                      ON mergerel.student_id = sso_users.uuid \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND sso_users.department_id = $1", [deptId]);

    let departmentFieldForProcedure = deptId;
    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (deptId.toString().length == 6) {
      departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(deptId);
    }

    const studentsWithFactorProcedureResult = await Promise.all(
      students.rows.map(async student => {
        const factorProcedureResult = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentFieldForProcedure], MiscUtils.splitStudentsAM(student.schacpersonaluniquecode));
        return {
          ...student,
          ...factorProcedureResult
        };
      })
    );

    return studentsWithFactorProcedureResult;
  } catch (error) {
    throw Error('Error while fetching students from phase 1 for this department');
  }
};

const getStudentsPhase2 = async (deptId, periodId) => {
  try {
    const students = await pool.query("SELECT * FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN semester_interest_apps apps ON apps.student_id = sso_users.uuid \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND sso_users.department_id = $1 \
                                      AND student_users.phase = '2' \
                                      AND apps.period_id = $2", [deptId, periodId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students from phase 2 for this department');
  }
};

const getRankedStudentsByDeptId = async (deptId, periodId) => {
  try {
    const students = await pool.query("SELECT * FROM students_approved_rank \
                                      INNER JOIN sso_users \
                                      ON students_approved_rank.sso_uid = sso_users.uuid \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      WHERE sso_users.department_id = $1 \
                                      AND students_approved_rank.period_id = $2 \
                                      ORDER BY ranking", [deptId, periodId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students from phase 2 for this department');
  }
};

const getRankdedStudentsListByDeptAndPeriodId = async (deptId, periodId) => {
  try {
    const students = await pool.query("SELECT students_approved_rank.*, sso_users.*, student_users.*, semester_interest_apps.protocol_number as latest_app_protocol_number \
                                      FROM students_approved_rank \
                                      INNER JOIN sso_users \
                                      ON students_approved_rank.sso_uid = sso_users.uuid \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN semester_interest_apps ON student_id = student_users.sso_uid AND semester_interest_apps.period_id = students_approved_rank.period_id \
                                      WHERE sso_users.department_id = $1 AND semester_interest_apps.period_id = $2  \
                                      UNION \
                                      SELECT students_approved_rank.*, sso_users.*, student_users.*, semester_interest_apps.protocol_number as latest_app_protocol_number \
                                      FROM students_approved_rank \
                                      RIGHT JOIN sso_users \
                                      ON students_approved_rank.sso_uid = sso_users.uuid \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN semester_interest_apps ON student_id = student_users.sso_uid AND semester_interest_apps.period_id = $2 \
                                      WHERE student_users.phase = -1 \
                                      ORDER BY ranking", [deptId, periodId]);

    let departmentFieldForProcedure = deptId;
    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (deptId.toString().length == 6) {
      departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(deptId);
    }

    // const studentsWithFactorProcedureResult = await Promise.all(
    //   students.rows.map(async student => {
    //     const factorProcedureResult = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentFieldForProcedure], MiscUtils.splitStudentsAM(student.schacpersonaluniquecode));
    //     return {
    //       ...student,
    //       ...factorProcedureResult
    //     };
    //   })
    // );
    const studentsWithFactorProcedureResult = [];
    for (const student of students.rows) {
      const factorProcedureResult = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentFieldForProcedure], MiscUtils.splitStudentsAM(student.schacpersonaluniquecode));
      studentsWithFactorProcedureResult.push({
        ...student,
        ...factorProcedureResult
      });
    }

    return studentsWithFactorProcedureResult;
  } catch (error) {
    throw Error('Error while fetching students list for this department ' + error.message);
  }
};

const getStudentActiveApplications = async (deptId) => {
  try {
    const applications = await pool.query(`SELECT * FROM active_applications a
                                          JOIN(SELECT MAX(id) as max_id FROM period WHERE department_id = $1 AND is_active = true) p
                                          ON a.period_id = p.max_id
                                          WHERE department_id = $1`, [deptId]);
    return applications.rows;
  } catch (error) {
    throw Error('Error while fetching student active applications');
  }
};

const getPeriodByUserId = async (id) => {
  try {
    const period = await pool.query("SELECT id, sso_user_id, available_positions, pyear, semester, phase_state, \
      to_char(\"date_from\", 'YYYY-MM-DD') as date_from, to_char(\"date_to\", 'YYYY-MM-DD') as date_to, espa_positions.positions as positions \
      FROM period \
      LEFT JOIN espa_positions ON espa_positions.department_id=period.department_id \
      WHERE period.sso_user_id = $1 \
      AND period.is_active = 'true' \
      LIMIT 1", [id]);
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period');
  }
};

const getPeriodByDepartmentId = async (id) => {
  try {
    const period = await pool.query("SELECT id, sso_user_id, available_positions, pyear, semester, phase_state, \
      to_char(\"date_from\", 'YYYY-MM-DD') as date_from, to_char(\"date_to\", 'YYYY-MM-DD') as date_to, espa_positions.positions as positions, period.department_id \
      FROM period \
      LEFT JOIN espa_positions ON espa_positions.department_id=period.department_id \
      WHERE period.department_id = $1 \
      AND period.is_active = 'true' \
      LIMIT 1", [id]);

    // if (!period.rows[0]) {
    //   logger.info("No period found with the given department id.");
    //   return null;
    // }

    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period by department id' + error.message);
  }
};

const getAllPeriodsByDepartmentId = async (departmentId) => {
  try {
    const period = await pool.query(`SELECT *
      FROM period
      INNER JOIN final_assignments_list list ON period.id = list.period_id
      WHERE period.department_id = $1 ORDER BY period.id DESC`, [departmentId]);

    return period.rows;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching period by department id' + error.message);
  }
};

const getPeriodAndDepartmentIdByUserId = async (id) => {
  try {
    const period = await pool.query(`SELECT period.id, period.department_id
                                    FROM period
                                    JOIN sso_users su ON su.department_id = period.department_id
                                    WHERE su.uuid = $1
                                    AND period.is_active = 'true'
                                    LIMIT 1`, [id]);
    return period.rows[0];
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching period');
  }
};

const getPhaseStateByPeriodId = async (id) => {
  try {
    const period = await pool.query("SELECT phase_state FROM period WHERE id = $1 LIMIT 1", [id]);

    return period.rows[0];
  } catch (error) {
    throw Error('Error while fetching phase state by period id' + error.message);
  }
};

const getEspaPositionsByDepartmentId = async (id) => {
  try {
    const period = await pool.query("SELECT espa_positions.positions as positions \
      FROM espa_positions \
      WHERE espa_positions.department_id = $1 \
      LIMIT 1", [id]);
    // if (!period.rows[0]) {
    //   logger.info("No period found with the given department id.");
    //   return null;
    // }
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching ESPA positions by department id' + error.message);
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

const splitScholarsPersonalData = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 2];
};

const splitStudentsAM = (splitString) => {
  const splitArray = splitString.split(':');
  return splitArray[splitArray.length - 1];
};

const getPositionsByApplicationId = async (applicationId) => {
  try {
    const positions = await pool.query(`SELECT final_app_positions.*, sso_users.department_id, student_applications.period_id
                                        FROM final_app_positions
                                        INNER JOIN sso_users ON sso_users.uuid = final_app_positions.student_id
										                    INNER JOIN student_applications ON student_applications.id = final_app_positions.application_id
                                        WHERE application_id = $1 ORDER BY priority`, [applicationId]);
    return positions.rows;
  } catch (error) {
    throw Error('Error while fetching positions by application id' + error.message);
  }
};

const getImplementationDatesByStudentAndPeriod = async (studentId, periodId, positionId) => {
  try {
    const positions = await pool.query(`SELECT to_char(\"pa_start_date\", 'YYYY-MM-DD') as pa_start_date, to_char(\"pa_end_date\", 'YYYY-MM-DD') as pa_end_date
                                        FROM internship_assignment
                                        WHERE student_id = $1 AND period_id = $2 AND position_id = $3`, [studentId, periodId, positionId]);
    return positions.rows;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching implementation dates by student and period ids' + error.message);
  }
};

const getFileMetadataByStudentId = async (userId, docType) => {
  try {
    const fileMetadata = await pool.query("SELECT * FROM sso_user_files \
                                          WHERE sso_uid = $1 \
                                          AND doc_type = $2 \
                                          ORDER BY file_id DESC", [userId, docType]);
    return fileMetadata;
  } catch (error) {
    throw Error('Error while fetching students');
  }
};

const updateImplementationDatesByStudentAndPeriod = async (studentId, periodId, implementationDates, positionId) => {
  try {
    const positions = await pool.query(`UPDATE internship_assignment
                                        SET pa_start_date = $1, pa_end_date = $2
                                        WHERE student_id = $3 AND period_id = $4 AND position_id = $5`,
      [implementationDates.implementation_start_date, implementationDates.implementation_end_date, studentId, periodId, positionId]);
    return positions.rows;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while updating implementation dates by student and period ids' + error.message);
  }
};

const insertPeriod = async (body, id, departmentId) => {
  try {
    await deactivateAllPeriodsByDepartmentId(departmentId);
    let pyear = body.date_from.split('-')[0];
    const insertResults = await pool.query("INSERT INTO period" +
      "(sso_user_id, available_positions, pyear, semester, phase_state, date_from, date_to, department_id, is_active, is_completed)" +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
      [id, body.available_positions, pyear, body.semester, body.phase_state, body.date_from, body.date_to, departmentId, true, false]);

    return insertResults.rows[0].id;
  } catch (error) {
    logger.info('Error while inserting period time ' + error.message);
    throw Error('Error while inserting period time');
  }
};

const insertApprovedStudentsRank = async (departmentId, genericPhase, periodId) => {
  // const STUDENT_SELECTION_PHASE = 2;
  try {
    // if (genericPhase < STUDENT_SELECTION_PHASE) {
    //   return;
    // }
    const getStudentsPhase = await getStudentsPhase2(departmentId, periodId);
    await deleteApprovedStudentsRank(departmentId, periodId);
    let i = 1;
    for (students of getStudentsPhase) {

      let departmentFieldForProcedure = students.department_id;
      // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
      if (students.department_id.toString().length == 6) {
        departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(students.department_id);
      }

      const procedureResults = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentFieldForProcedure], MiscUtils.splitStudentsAM(students.schacpersonaluniquecode));
      // logger.info(procedureResults.Grade + " | " + MiscUtils.departmentsMap[departmentId] + " | " + MiscUtils.splitStudentsAM(students.schacpersonaluniquecode) + " | " + students.department_id);

      let calculatedScore = 0;
      if (procedureResults.Grade == null || procedureResults.Ects == null || procedureResults.Semester == null || procedureResults.Praktiki == null) {
        logger.error("some student details fetched from procedure were null");
        //continue;
      } else {
        calculatedScore = await calculateScore(procedureResults, students.department_id);
      }

      await pool.query(`
        INSERT INTO students_approved_rank
        (sso_uid, department_id, score, grade, ects, semester, ranking, period_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [students.sso_uid, departmentId, calculatedScore, procedureResults.Grade, procedureResults.Ects, procedureResults.Semester, i++, periodId]);
    }

    await pool.query(`UPDATE students_approved_rank
                      SET ranking = new_ranking,
                      is_approved = (CASE
                        WHEN (SELECT positions FROM espa_positions WHERE department_id = $2 LIMIT 1) = 0 THEN false
                        WHEN new_ranking <= (SELECT positions FROM espa_positions WHERE department_id = $2 LIMIT 1) THEN true
                        ELSE false
                      END)
                      FROM (
                        SELECT student_users.sso_uid, department_id, score, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY
                        CASE
                          WHEN student_users.amea_cat = true THEN 0
                          ELSE 1
                        END, score DESC) as new_ranking
                        FROM students_approved_rank
                        INNER JOIN student_users ON students_approved_rank.sso_uid = student_users.sso_uid
                        WHERE students_approved_rank.period_id = $1
                      ) s
                      WHERE students_approved_rank.sso_uid = s.sso_uid
                      AND students_approved_rank.department_id = s.department_id
                      AND students_approved_rank.period_id = $1`, [periodId, departmentId]);
  } catch (error) {
    logger.info('Error while inserting Approved students rank ' + error.message);
    throw Error('Error while inserting Approved students rank');
  }
};

const calculateScore = async (procedureResults, departmentId) => {
  const ECTS_PER_SEMESTER = 30;
  // max years of study: 4 or 5 years depending on the school
  const N = (await getDepartmentDetails(departmentId)).years_of_study;
  // all weights sum must be equal to 1
  const weightGrade = 0.5;
  const weightSemester = 0.4;
  const weightYearOfStudy = 0.1;

  let semester = procedureResults.Semester;
  let academicYear = Math.round(semester / 2);
  let yearTotal = (academicYear <= N) ? 100 : 100 - 10 * (academicYear - N);
  if (yearTotal < 0) yearTotal = 0;

  const capped = 2 * (N - 1);
  const maxECTS = capped * ECTS_PER_SEMESTER;
  const studentsECTS = (procedureResults.Ects > maxECTS) ? maxECTS : procedureResults.Ects;

  // return the actual calculation
  return ((procedureResults.Grade * 10 * weightGrade) +
    ((studentsECTS / maxECTS) * 100 * weightSemester) +
    (yearTotal * weightYearOfStudy)).toFixed(3);
};

const getStudentFactorProcedure = async (depId, studentAM) => {
  try {
    //logger.info(mssql);
    // make sure that any items are correctly URL encoded in the connection string
    if (process.env.ENV == 'DEV') {
      return {
        Grade: 8.5,
        Ects: Math.floor(Math.random() * (150 - 21)) + 20,
        Semester: 2,
        Praktiki: true,
        CourseCount: 10
      };
    }
    let mspool = await msql.connect(mssql);

    const result = await mspool.request()
      .input('DepId', msql.Int, depId)
      .input('am', msql.VarChar(100), studentAM)
      .execute('usp_GetStudentFactorPraktiki');
    //logger.info(result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    logger.info("error: " + error);
  }
};

const getDepartmentDetails = async (departmentId) => {
  try {
    const department = await pool.query("SELECT * FROM atlas_academics WHERE atlas_id = $1", [departmentId]);
    return department.rows[0];
  } catch (error) {
    throw Error('Error while getting department\'s details ' + error.message);
  }
};

const deactivateAllPeriodsByDepartmentId = async (departmentId) => {
  try {
    const insertResults = await pool.query("UPDATE period \
                                            SET is_active = 'false' \
                                            WHERE department_id = $1", [departmentId]);
    return insertResults;
  } catch (error) {
    throw Error('Error while deactivating periods');
  }
};

const updatePeriodById = async (body, id) => {
  try {
    let pyear = body.date_from.split('-')[0];
    const updateResults = await pool.query("UPDATE period" +
      " SET available_positions = $1, pyear = $2, semester = $3, phase_state = $4, date_from= $5, date_to = $6" +
      " WHERE id = $7",
      [body.available_positions, pyear, body.semester, body.phase_state, body.date_from, body.date_to, id]);
    return updateResults;
  } catch (error) {
    logger.info('Error while updating period time ' + error.message);
    throw Error('Error while updating period time');
  }
};

const updatePhaseByStudentId = async (phase, studentId, periodId) => {
  try {
    const status = {
      APP_INACTIVE: false,
      APP_ACTIVE: true
    };

    const studentPhase = {
      REJECTED: -1,
      UNHANDLED: 0,
      PENDING: 1,
      ACCEPTED: 2,
      RESIGNED: 3,
    };

    const insertResults = await pool.query("UPDATE student_users \
                                            SET phase = $1 WHERE sso_uid = $2 ", [phase, studentId]);

    if (phase && (Number(phase) == studentPhase.REJECTED || Number(phase) == studentPhase.RESIGNED)) {
      await deactivateApplicationIfExists(status.APP_INACTIVE, studentId, periodId);
    } else if (phase && Number(phase) == studentPhase.ACCEPTED) {
      await deactivateApplicationIfExists(status.APP_ACTIVE, studentId, periodId);
    }

    return insertResults;
  } catch (error) {
    logger.info('Error while updating students phase' + error.message);
    throw Error('Error while updating students phase');
  }
};

const deactivateApplicationIfExists = async (updateStatus, studentId, periodId) => {
  try {
    if (!periodId || !studentId) {
      return;
    }

    const studentHasAppQuery = await pool.query(`SELECT id FROM student_applications
                                                WHERE student_id = $1 AND period_id = $2
                                                ORDER BY id DESC LIMIT 1`, [studentId, periodId]);

    const latestAppId = studentHasAppQuery?.rows[0]?.id;

    if (studentHasAppQuery.rows.length > 0) {
      await pool.query(`UPDATE student_applications
                        SET application_status = $1
                        WHERE student_id = $2 AND period_id = $3 AND id = $4`, [updateStatus, studentId, periodId, latestAppId]);
    }
  } catch (error) {
    logger.info('Error while updating students phase' + error.message);
    throw Error('Error while updating students phase');
  }
};

const deletePeriodById = async (id) => {
  try {
    await pool.query("UPDATE period \
                      SET is_active = 'false' \
                      WHERE id = $1", [id]);
    await updateStudentPhaseByPeriod(id);
  } catch (error) {
    logger.info('Error while deleting period ' + error.message);
    throw Error('Error while deleting period');
  }
};

const updateStudentPhaseByPeriod = async (periodId) => {
  try {
    const students = await pool.query("UPDATE student_users \
                                       SET phase = '0' \
                                       WHERE sso_uid IN \
                                       (SELECT student_id FROM semester_interest_apps WHERE period_id = $1 AND phase != 0)", [periodId]);
    return students.rows;
  } catch (error) {
    logger.error('Error updating phase of students:' + error.message);
    throw Error('Error updating phase of students:' + error.message);
  }
};

const deleteApprovedStudentsRank = async (departmentId, periodId) => {
  try {
    await pool.query("DELETE FROM students_approved_rank WHERE department_id = $1 AND period_id = $2", [departmentId, periodId]);
  } catch (error) {
    logger.info('Error while deleting approved students ' + error.message);
    throw Error(`Error while deleting approved student ( for department_id: ${departmentId} )`);
  }
};

const updateStudentRanking = async (periodId, body) => {
  try {
    for (let i = 0; i < body.length; i++) {
      await pool.query(`UPDATE students_approved_rank
                        SET ranking = $1, is_approved = $2
                        WHERE sso_uid = $3 AND period_id = $4`, [body[i].ranking, body[i].is_approved, body[i].uuid, periodId]);
    }
  } catch (error) {
    throw Error('Error while updating student positions ' + error.message);
  }
};

const insertCommentsByStudentId = async (studentId, comments, subject) => {
  try {
    await pool.query("INSERT INTO comments(comment_text, comment_date, student_id, comment_subject) \
                      VALUES ($1, NOW(), $2, $3)", [comments, studentId, subject]);
  } catch (error) {
    logger.info('Error while inserting comments ' + error.message);
    throw Error('Error while inserting comments');
  }
};

const updateCommentsByStudentId = async (studentId, comments) => {
  try {
    // Update comments of student; subject should also be added to be safer
    await pool.query("UPDATE comments \
                      SET comment_text = $1, comment_date = NOW() \
                      WHERE student_id = $2", [comments, studentId]);
  } catch (error) {
    logger.info('Error while updating comments ' + error.message);
    throw Error('Error while updating comments');
  }
};

const getCommentByStudentIdAndSubject = async (studentId, subject) => {
  try {
    const comment = await pool.query("SELECT * FROM comments WHERE student_id = $1 AND comment_subject = $2", [studentId, subject]);
    return comment.rows[0];
  } catch (error) {
    logger.info('Error while getting comments ' + error.message);
    throw Error('Error while getting comments');
  }
};

const getCompletedPeriods = async (departmentId) => {
  try {
    const periods = await pool.query("SELECT * FROM period WHERE department_id = $1 AND is_completed = true AND is_active = false", [departmentId]);
    return periods.rows;
  } catch (error) {
    logger.info('Error while getting periods ' + error.message);
    throw Error('Error while getting periods ' + error.message);
  }
};

const getManagedAcademicsByUserId = async (userId) => {
  try {
    const academics = await pool.query(`SELECT atlas_academics.department, atlas_academics.atlas_id
                                        FROM atlas_academics
                                        JOIN role_manages_academics ON atlas_academics.atlas_id = role_manages_academics.academic_id
                                        JOIN users_roles ON role_manages_academics.user_role_id = users_roles.user_role_id
                                        JOIN sso_users ON sso_users.id = users_roles.sso_username
                                        WHERE sso_users.uuid = $1`, [userId]);
    return academics.rows;
  } catch (error) {
    logger.info('Error while getting managed academics: ' + error.message);
    throw Error('Error while getting managed academics: ' + error.message);
  }
};

const updateDepartmentIdByUserId = async (userId, departmentId) => {
  try {
    await pool.query("UPDATE sso_users SET department_id = $1 WHERE uuid = $2", [departmentId, userId]);
    logger.info(`Record with userId ${userId} updated successfully`);
  } catch (error) {
    logger.error(error);
    throw Error(`An error occured while updating department id: ${error}`);
  }
};

const getPhasesByPeriodId = async (periodId) => {
  try {
    const phases = await pool.query("SELECT phase_number, date_from, date_to FROM phase WHERE period_id = $1 ORDER BY phase_number", [periodId]);
    return phases.rows;
  } catch (error) {
    logger.info('Error while getting phases ' + error.message);
    throw Error('Error while getting phases ' + error.message);
  }
};

const insertPhaseOfPeriod = async (periodId, phaseNumber, phase) => {
  try {
    const result = await pool.query("INSERT INTO phase (phase_number, period_id, date_from, date_to) VALUES ($1, $2, $3, $4)", [phaseNumber, periodId, phase.date_from, phase.date_to]);
    return result;
  } catch (error) {
    logger.info('Error while inserting phase ' + error.message);
    throw Error('Error while inserting phase ' + error.message);
  }
};

const updatePhaseOfPeriod = async (periodId, phaseNumber, phase) => {
  try {
    const result = await pool.query("UPDATE phase SET date_from = $1, date_to = $2 WHERE period_id = $3 and phase_number = $4", [phase.date_from, phase.date_to, periodId, phaseNumber]);
    return result;
  } catch (error) {
    logger.info('Error while updating phase ' + error.message);
    throw Error('Error while updating phase ' + error.message);
  }
};

const getPhaseOfPeriod = async (periodId, phase_state) => {
  try {
    const phase = await pool.query("SELECT * FROM phase WHERE period_id = $1 AND phase_number = $2", [periodId, phase_state]);
    return phase.rows[0];
  } catch (error) {
    logger.info('Error while getting phase ' + error.message);
    throw Error('Error while getting phase ' + error.message);
  }
};

const doesAssignmentExist = async (body) => {
  try {
    const result = await pool.query(`SELECT 1 FROM internship_assignment
      WHERE position_id = $1 AND student_id = $2 AND period_id = $3`, [body.position_id, body.student_id, body.period_id]);

    return result.rows.length > 0;
  } catch (error) {
    logger.info('Error while checking if assignment exists ' + error.message);
    throw Error('Error while checking if assignment exists ' + error.message);
  }
};

const insertAssignment = async (body, stateOptionalParam = 0) => {
  try {
    const STATE = stateOptionalParam || 0;
    let positionData;

    const result = await pool.query(`SELECT 1 FROM internship_assignment
      WHERE position_id = $1 AND student_id = $2 AND period_id = $3`, [body.position_id, body.student_id, body.period_id]);

    // If already exists, preassign for this student has been done
    if (result.rows.length > 0) return;

    // Get atlas position details
    if (body.position_id != null)
      positionData = await atlasService.getPositionGroupFromDBById(body.position_id);

    await pool.query("INSERT INTO internship_assignment(assignment_id, position_id, internal_position_id, student_id, time_span, physical_objects, city, status, pa_subject_atlas, period_id) " +
      " VALUES" +
      " (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [body.position_id, body.internal_position_id, body.student_id, positionData.duration, positionData.physical_objects, body.city, STATE, positionData.title, body.period_id]);

  } catch (error) {
    logger.error("insertAssignment error: " + error.message);
    throw Error('Error while inserting assignment' + error.message);
  }
};

const getPreassignModeByDepartmentId = async (departmentId) => {
  try {
    const preassignMode = await pool.query("SELECT preassign " +
      " FROM atlas_academics" +
      " WHERE atlas_id = $1", [departmentId]);
    return preassignMode.rows[0];
  } catch (error) {
    throw Error('Error while getting preassign mode for department id ' + departmentId);
  }
};


const getAssignmentsByStudentAndPositionId = async (studentId, positionId) => {
  try {
    // assignment status should go in the where clause too
    const assignments = await pool.query(`SELECT * FROM internship_assignment
                                          INNER JOIN atlas_position_group
                                          ON internship_assignment.position_id = atlas_position_group.atlas_position_id
                                          INNER JOIN atlas_provider
                                          ON atlas_position_group.provider_id = atlas_provider.atlas_provider_id
                                          INNER JOIN semester_interest_apps
                                          ON internship_assignment.student_id = semester_interest_apps.student_id
                                          AND internship_assignment.period_id = semester_interest_apps.period_id
                                          INNER JOIN period ON period.id = internship_assignment.period_id
                                          and period.is_active = true
                                          WHERE internship_assignment.student_id = $1
                                          AND  internship_assignment.position_id = $2 `, [studentId, positionId]);

    return assignments.rows[0];
  } catch (error) {
    logger.info('Error while getting assignments ' + error.message);
    throw Error('Error while getting assignments');
  }
};

const getAssignmentsByStudentId = async (studentId) => {
  try {
    // assignment status should go in the where clause too
    const assignments = await pool.query(`SELECT * FROM internship_assignment
                                          INNER JOIN atlas_position_group
                                          ON internship_assignment.position_id = atlas_position_group.atlas_position_id
                                          INNER JOIN atlas_provider
                                          ON atlas_position_group.provider_id = atlas_provider.atlas_provider_id
                                          INNER JOIN semester_interest_apps
                                          ON internship_assignment.student_id = semester_interest_apps.student_id
                                          AND internship_assignment.period_id = semester_interest_apps.period_id
                                          INNER JOIN period ON period.id = internship_assignment.period_id
                                          and period.is_active = true
                                          WHERE internship_assignment.student_id = $1`, [studentId]);

    return assignments.rows;
  } catch (error) {
    logger.info('Error while getting assignments ' + error.message);
    throw Error('Error while getting assignments');
  }
};

const insertAssignImplementationDates = async (body) => {
  try {
    // Delete existing dates of this period and department
    await pool.query("DELETE FROM assignment_details WHERE department_id = $1 AND period_id = $2", [body.department_id, body.period_id]);

    const formattedStartDate = moment(body.implementation_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    const formattedEndDate = moment(body.implementation_end_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    await pool.query("INSERT INTO assignment_details(implementation_start_date, implementation_end_date, department_id, period_id) " +
      " VALUES ($1, $2, $3, $4)",
      [formattedStartDate, formattedEndDate, body.department_id, body.period_id]);

  } catch (error) {
    throw Error('Error while inserting assignment implementation dates' + error.message);
  }
};

const getAssignImplementationDates = async (departmentId, periodId) => {
  try {
    const dates = await pool.query("SELECT * FROM assignment_details WHERE department_id = $1 AND period_id = $2", [departmentId, periodId]);
    return dates.rows[0];
  } catch (error) {
    throw Error('Error while getting assignment implementation dates' + error.message);
  }
};

const getStudentAMandDepartmentByIdForAtlas = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT schacpersonaluniquecode as student_registry, department_id FROM sso_users \
                                              WHERE sso_users.uuid = $1", [id]);

    const firstRow = resultsSSOUsers.rows[0];
    const student = {
      registry_number: MiscUtils.splitStudentsAMForAtlas(firstRow.student_registry),
      department_id: firstRow.department_id
    };
    return student;
  } catch (error) {
    throw Error('Error while fetching students' + error.message);
  }
};

const getDepManagerDetails = async (period_id, uuid) => {
  try {
    const result = await pool.query(`SELECT department AS dept_name, usr.displayname as department_manager_name, det.implementation_start_date AS start_date, det.implementation_end_date AS end_date
                            FROM sso_users usr
                            INNER JOIN atlas_academics ON atlas_academics.atlas_id = usr.department_id
                            INNER JOIN assignment_details det ON det.department_id = usr.department_id AND det.period_id = $1
                            WHERE uuid = $2`, [period_id, uuid]);
    return result.rows[0];
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching dep manager details ' + error.message);
  }
};

const insertToFinalAssignmentsList = async (body, managerInfo) => {
  try {
    const startDateFormatted = moment(managerInfo.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const endDateFormatted = moment(managerInfo.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const insertResult = await pool.query("INSERT INTO final_assignments_list(department_id, period_id, creation_date, department_manager_name, dept_name, start_date, end_date, apofasi, arithmos_sunedriashs, ada_number) " +
      "VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8, $9) RETURNING list_id",
      [body.department_id, body.period_id, managerInfo.department_manager_name, managerInfo.dept_name, startDateFormatted, endDateFormatted, null, null, null]);

    return insertResult.rows[0].list_id;
  } catch (error) {
    logger.error(error.message);
    throw new Error('Error while inserting to final assignments list ' + error.message);
  }
};

const doesListExistForDepartmentAndPeriod = async (body) => {
  try {
    const insertResult = await pool.query("SELECT * FROM final_assignments_list WHERE department_id = $1 AND period_id = $2",
      [body.department_id, body.period_id]);

    const listExists = insertResult?.rows?.length > 0;
    const listId = listExists ? insertResult.rows[0].list_id : null;
    return { listExists, listId };
  } catch (error) {
    logger.error(error.message);
    throw new Error('Error while checking if list exists ' + error.message);
  }
};

const updateStudentFinalAssignments = async (depManagerDetails, listId, body) => {
  try {
    const updateResult = await pool.query("UPDATE internship_assignment SET list_id = $1 WHERE period_id = $2 AND approval_state = 1",
      [listId, body.period_id]);

    return updateResult.rows;
  } catch (error) {
    logger.error(error.message);
    throw new Error('Error while updating internship assignments ' + error.message);
  }
};

const setPeriodCompleted = async (body) => {
  logger.info("setPeriodCompleted started for department " + body.department_id + " at: " + new Date().toLocaleString());
  try {
    await pool.query("UPDATE period  \
                      SET is_active = 'false', \
                          is_completed = 'true' \
                      WHERE department_id = $1 AND id = $2 AND phase_state >= 2",
      [body.department_id, body.period_id]);
    logger.info("period completed for department" + body.department_id + " at: " + new Date().toLocaleString());
  } catch (error) {
    logger.error(error.message);
    throw Error("Error while updating period in job: " + error.message);
  }
};

const getStudentListForPeriod = async (periodId) => {
  try {
    const result = await pool.query(`SELECT * FROM final_assignments_list list
                                    INNER JOIN internship_assignment asn ON asn.period_id = list.period_id
                                    INNER JOIN sso_users usr ON usr.uuid = asn.student_id AND asn.list_id IS NOT NULL
                                    INNER JOIN student_users stu ON stu.sso_uid = usr.uuid
                                    WHERE list.period_id = $1`, [periodId]);
    return result.rows;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching student list for period ' + error.message);
  }
};

const getStudentPaymentsListForPeriod = async (periodId) => {
  try {
    const result = await pool.query(`SELECT list.*, asn.*, usr.*, exit_form.ops_number_exodou
                                    FROM final_assignments_list list
                                    INNER JOIN internship_assignment asn ON asn.period_id = list.period_id
                                    INNER JOIN sso_users usr ON usr.uuid = asn.student_id AND asn.list_id IS NOT NULL
                                    INNER JOIN entry_form ON usr.uuid = entry_form.student_id
                                    INNER JOIN exit_form ON usr.uuid = exit_form.student_id
                                    WHERE list.period_id = $1`, [periodId]);
    return result.rows;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching student list (payment-orders) for period ' + error.message);
  }
};

const updateEspaPositionsOnPeriodCompleted = async (data) => {
  try {
    const positionEspaCount = await pool.query("SELECT positions FROM espa_positions WHERE department_id = $1", [data.department_id]);
    const studentsInListCnt = await pool.query(`SELECT count(*) as assignments_count
                                              FROM final_assignments_list list
                                              INNER JOIN internship_assignment a
                                              ON a.period_id = list.period_id
                                              WHERE list.department_id = $1 AND list.period_id = $2`, [data.department_id, data.period_id]);

    const newResultAfterSubstraction = parseInt(positionEspaCount.rows[0].positions) - parseInt(studentsInListCnt.rows[0].assignments_count);
    const finalResult = await pool.query(`UPDATE espa_positions SET positions = $1 WHERE department_id = $2`, [newResultAfterSubstraction, data.department_id]);

    return finalResult;
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching student list for period ' + error.message);
  }
};

const deleteCreatedList = async (listId, periodId) => {
  try {
    await pool.query(`DELETE FROM final_assignments_list WHERE list_id = $1 AND period_id = $2`, [listId, periodId]);
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while fetching student list for period ' + error.message);
  }
};

const updateAssignmentImplementationDates = async (implementationDates, assignment) => {
  try {
    const { implementation_start_date, implementation_end_date } = implementationDates;
    const startDateFormatted = moment(implementation_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const endDateFormatted = moment(implementation_end_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    await pool.query(`UPDATE internship_assignment
                      SET pa_start_date = $1, pa_end_date = $2
                      WHERE position_id = $3
                      AND student_id = $4
                      AND period_id = $5`, [startDateFormatted, endDateFormatted, assignment.position_id, assignment.student_id, assignment.period_id]);
  } catch (error) {
    logger.error(error.message);
    throw Error('Error while updating assignment implementation dates for position: ' + assignment.position_id +
      ' student: ' + assignment.student_id +
      ' error: ' + error.message);
  }
};

module.exports = {
  getDepManagerById,
  getDepartmentNameByNumber,
  getPeriodByUserId,
  getPeriodByDepartmentId,
  getStudentsApplyPhase,
  getRankedStudentsByDeptId,
  getStudentActiveApplications,
  getStudentsWithSheetInput,
  getStudentsWithSheetOutput,
  getEspaPositionsByDepartmentId,
  getPhaseStateByPeriodId,
  getRankdedStudentsListByDeptAndPeriodId,
  getAssignImplementationDates,
  getPeriodAndDepartmentIdByUserId,
  getStudentAMandDepartmentByIdForAtlas,
  getStudentListForPeriod,
  getStudentPaymentsListForPeriod,
  getAllPeriodsByDepartmentId,
  doesAssignmentExist,
  doesListExistForDepartmentAndPeriod,
  insertPeriod,
  insertApprovedStudentsRank,
  updatePeriodById,
  updatePhaseByStudentId,
  updateStudentRanking,
  updateAssignmentImplementationDates,
  deletePeriodById,
  insertCommentsByStudentId,
  updateCommentsByStudentId,
  updateEspaPositionsOnPeriodCompleted,
  getCommentByStudentIdAndSubject,
  getCompletedPeriods,
  getManagedAcademicsByUserId,
  updateDepartmentIdByUserId,
  login,
  getPhasesByPeriodId,
  insertPhaseOfPeriod,
  getPhaseOfPeriod,
  updatePhaseOfPeriod,
  getPositionsByApplicationId,
  getImplementationDatesByStudentAndPeriod,
  updateImplementationDatesByStudentAndPeriod,
  insertAssignment,
  getPreassignModeByDepartmentId,
  getAssignmentsByStudentId,
  getAssignmentsByStudentAndPositionId,
  insertAssignImplementationDates,
  insertToFinalAssignmentsList,
  updateStudentFinalAssignments,
  getDepManagerDetails,
  setPeriodCompleted,
  deleteCreatedList
};
