// database connection configuration
const pool = require("../db_config.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const MiscUtils = require("../MiscUtils.js");
const atlasService = require("./atlasService.js");

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
    throw Error('Error while fetching students list for this department ' + error.message);
  }
};

const getStudentActiveApplications = async (deptId) => {
  try {
    const applications = await pool.query(`SELECT * FROM active_applications a
                                          JOIN(SELECT MAX(id) as max_id FROM period) p
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
    //   console.log("No period found with the given department id.");
    //   return null;
    // }

    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching period by department id' + error.message);
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
    //   console.log("No period found with the given department id.");
    //   return null;
    // }
    const periodResults = period.rows[0];
    let periodResultsObj = Object.assign(periodResults);
    return periodResultsObj;
  } catch (error) {
    throw Error('Error while fetching ESPA positions by department id' + error.message);
  }
};


const getStudentsWithSheetInput = async (departmentId) => {
  try {
    const students = await pool.query("SELECT * FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN entry_form \
                                      ON student_users.sso_uid = entry_form.student_id \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND student_users.phase = '2' \
                                      AND sso_users.department_id = $1", [departmentId]);
    return students.rows;
  } catch (error) {
    throw Error('Error while fetching students with input sheet' + error.message);
  }
};

const getStudentsWithSheetOutput = async (departmentId) => {
  try {
    const students = await pool.query("SELECT * FROM sso_users \
                                      INNER JOIN student_users \
                                      ON sso_users.uuid = student_users.sso_uid \
                                      INNER JOIN exit_form \
                                      ON student_users.sso_uid = exit_form.student_id \
                                      WHERE sso_users.edupersonprimaryaffiliation='student' \
                                      AND student_users.phase = '2' \
                                      AND sso_users.department_id = $1", [departmentId]);
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
    const positions = await pool.query(`SELECT final_app_positions.*, sso_users.department_id
                                        FROM final_app_positions
                                        INNER JOIN sso_users ON sso_users.uuid = final_app_positions.student_id
                                        WHERE application_id = $1`, [applicationId]);
    return positions.rows;
  } catch (error) {
    throw Error('Error while fetching positions by application id' + error.message);
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
    console.log('Error while inserting period time ' + error.message);
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
      // console.log(procedureResults.Grade + " | " + MiscUtils.departmentsMap[departmentId] + " | " + MiscUtils.splitStudentsAM(students.schacpersonaluniquecode) + " | " + students.department_id);

      let calculatedScore = 0;
      if (procedureResults.Grade == null || procedureResults.Ects == null || procedureResults.Semester == null || procedureResults.Praktiki == null) {
        console.error("some student details fetched from procedure were null");
        //continue;
      } else {
        calculatedScore = await calculateScore(procedureResults, students.department_id);
      }
      await pool.query("INSERT INTO students_approved_rank " +
        "(sso_uid, department_id, score, ranking, period_id)" +
        " VALUES " + "($1, $2, $3, $4, $5)",
        [students.sso_uid, departmentId, calculatedScore, i++, periodId]);
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
    console.log('Error while inserting Approved students rank ' + error.message);
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
    //console.log(mssql);
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
    //console.log(result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    console.log("error: " + error);
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
    console.log('Error while updating period time ' + error.message);
    throw Error('Error while updating period time');
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
    await updateStudentPhaseByPeriod(id);
  } catch (error) {
    console.log('Error while deleting period ' + error.message);
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
    console.error('Error updating phase of students:' + error.message);
    throw Error('Error updating phase of students:' + error.message);
  }
};

const deleteApprovedStudentsRank = async (departmentId, periodId) => {
  try {
    await pool.query("DELETE FROM students_approved_rank WHERE department_id = $1 AND period_id = $2", [departmentId, periodId]);
  } catch (error) {
    console.log('Error while deleting approved students ' + error.message);
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
    console.log('Error while inserting comments ' + error.message);
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
    console.log('Error while updating comments ' + error.message);
    throw Error('Error while updating comments');
  }
};

const getCommentByStudentIdAndSubject = async (studentId, subject) => {
  try {
    const comment = await pool.query("SELECT * FROM comments WHERE student_id = $1 AND comment_subject = $2", [studentId, subject]);
    return comment.rows[0];
  } catch (error) {
    console.log('Error while getting comments ' + error.message);
    throw Error('Error while getting comments');
  }
};

const getCompletedPeriods = async (departmentId) => {
  try {
    const periods = await pool.query("SELECT * FROM period WHERE department_id = $1 AND is_completed = true AND is_active = false", [departmentId]);
    return periods.rows;
  } catch (error) {
    console.log('Error while getting periods ' + error.message);
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
    console.log('Error while getting managed academics: ' + error.message);
    throw Error('Error while getting managed academics: ' + error.message);
  }
};

const updateDepartmentIdByUserId = async (userId, departmentId) => {
  try {
    await pool.query("UPDATE sso_users SET department_id = $1 WHERE uuid = $2", [departmentId, userId]);
    console.log(`Record with userId ${userId} updated successfully`);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while updating department id: ${error}`);
  }
};

const getPhasesByPeriodId = async (periodId) => {
  try {
    const phases = await pool.query("SELECT phase_number, date_from, date_to FROM phase WHERE period_id = $1 ORDER BY phase_number", [periodId]);
    return phases.rows;
  } catch (error) {
    console.log('Error while getting phases ' + error.message);
    throw Error('Error while getting phases ' + error.message);
  }
};

const insertPhaseOfPeriod = async (periodId, phaseNumber, phase) => {
  try {
    const result = await pool.query("INSERT INTO phase (phase_number, period_id, date_from, date_to) VALUES ($1, $2, $3, $4)", [phaseNumber, periodId, phase.date_from, phase.date_to]);
    return result;
  } catch (error) {
    console.log('Error while inserting phase ' + error.message);
    throw Error('Error while inserting phase ' + error.message);
  }
};

const updatePhaseOfPeriod = async (periodId, phaseNumber, phase) => {
  try {
    const result = await pool.query("UPDATE phase SET date_from = $1, date_to = $2 WHERE period_id = $3 and phase_number = $4", [phase.date_from, phase.date_to, periodId, phaseNumber]);
    return result;
  } catch (error) {
    console.log('Error while updating phase ' + error.message);
    throw Error('Error while updating phase ' + error.message);
  }
};

const getPhaseOfPeriod = async (periodId, phase_state) => {
  try {
    const phase = await pool.query("SELECT * FROM phase WHERE period_id = $1 AND phase_number = $2", [periodId, phase_state]);
    return phase.rows[0];
  } catch (error) {
    console.log('Error while getting phase ' + error.message);
    throw Error('Error while getting phase ' + error.message);
  }
};

const insertAssignment = async (body) => {
  try {
    const STATE = 0;
    let positionData;

    // Get atlas position details
    if (body.position_id != null)
      positionData = await atlasService.getPositionGroupFromDBById(body.position_id);

    await pool.query("INSERT INTO internship_assignment(position_id, internal_position_id, student_id, time_span, physical_objects, city, status, period_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5, $6, $7, $8)",
      [body.position_id, body.internal_position_id, body.student_id, positionData.duration, positionData.physical_objects, body.city, STATE, body.period_id]);

  } catch (error) {
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
  insertPeriod,
  insertApprovedStudentsRank,
  updatePeriodById,
  updatePhaseByStudentId,
  updateStudentRanking,
  deletePeriodById,
  insertCommentsByStudentId,
  updateCommentsByStudentId,
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
  insertAssignment,
  getPreassignModeByDepartmentId
};
