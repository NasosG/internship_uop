// database connection configuration
// const { addSyntheticLeadingComment } = require("typescript");
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const moment = require('moment');
// require('dotenv').config();

const getAllStudents = async () => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.edupersonprimaryaffiliation = 'student'");
    return resultsSSOUsers.rows;
  } catch (error) {
    throw Error('Error while fetching students');
  }
};

const getStudentsSecretaryDetails = async (departmentId, AM) => {
  try {
    let procedureResults;

    // if (process.env.env == 'dev') {
    //   return {
    //     'Grade': 0, 'Ects': 1, 'Semester': 2, 'Praktiki': 0
    //   };
    // }

    try {
      procedureResults = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentId], MiscUtils.splitStudentsAM(AM));
    } catch (exc) {
      console.log("SQLException or timeout occurred: " + exc.message);
      return {
        'Grade': 0,
        'Ects': 0,
        'Semester': 0,
        'Praktiki': 0
      };
    }

    if (procedureResults.Grade == null || procedureResults.Ects == null || procedureResults.Semester == null || procedureResults.Praktiki == null) {
      console.error("some student details fetched from procedure were null");
      return {
        'Grade': 0,
        'Ects': 0,
        'Semester': 0,
        'Praktiki': 0
      };
    }

    return procedureResults;
  } catch (error) {
    console.log('Error while inserting Approved students rank ' + error.message);
    throw Error('Error while inserting Approved students rank');
  }
};

const getStudentFactorProcedure = async (depId, studentAM) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let mspool = await msql.connect(mssql);

    const result = await mspool.request()
      .input('DepId', msql.Int, depId)
      .input('am', msql.VarChar(100), studentAM)
      .execute('usp_GetStudentFactorPraktiki');

    return result.recordset[0];
  } catch (error) {
    // error checks
    throw Error('error' + error);
    //console.log("error: " + error);
  }
};

const getStudentById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.uuid = $1", [id]);
    // const student = resultsSSOUsers.rows;
    // return student;
    const student = resultsSSOUsers.rows[0];
    const studentDetailsProcedure = await getStudentsSecretaryDetails(student.department_id, student.schacpersonaluniquecode);
    let studentDetails = Object.assign(student, studentDetailsProcedure);
    return [studentDetails];
  } catch (error) {
    throw Error('Error while fetching students' + error.message);
  }
};

// dummy login with username only for testing purposes
const loginStudent = async (username) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.edupersonprimaryaffiliation = 'student' \
                                              AND sso_users.id=$1", [username]);
    if (resultsSSOUsers.rowCount >= 1) {
      return resultsSSOUsers.rows[0].uuid;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in');
  }
};

const getStudentEntrySheets = async (id) => {
  try {
    const resultsEntrySheets = await pool.query("SELECT * FROM entry_form where student_id = $1", [id]);
    return resultsEntrySheets;
  } catch (error) {
    throw Error('Error while fetching student entry sheet');
  }
};

const getStudentExitSheets = async (id) => {
  try {
    const resultsExitSheet = await pool.query("SELECT * FROM exit_form where student_id = $1", [id]);
    return resultsExitSheet.rows;
  } catch (error) {
    throw Error('Error while fetching student exit sheet');
  }
};

const getStudentEvaluationSheets = async (id) => {
  try {
    const resultsEvaluationSheet = await pool.query("SELECT * FROM evaluation_form where student_id = $1", [id]);
    return resultsEvaluationSheet.rows;
  } catch (error) {
    throw Error('Error while fetching student evaluation sheet');
  }
};

const getStudentPositions = async (id) => {
  try {
    const resultsStudentPositions = await pool.query("SELECT id, student_id, priority, company, title, place, to_char(\"upload_date\", 'DD/MM/YYYY') as upload_date, position_id, afm, internal_position_id \
                                                      FROM student_positions \
                                                      WHERE student_id = $1 \
                                                      ORDER BY priority", [id]);
    return resultsStudentPositions.rows;
  } catch (error) {
    throw Error('Error while fetching student positions');
  }
};

const getStudentApplications = async (studentId) => {
  try {
    return await pool.query("SELECT  id, student_id, positions, to_char(\"application_date\", 'DD/MM/YYYY') as application_date, application_status \
                            FROM student_applications \
                            WHERE student_id = $1", [studentId]);
  } catch (error) {
    throw Error('Error while fetching student applications');
  }
};

const getStudentActiveApplication = async (studentId) => {
  try {
    return await pool.query("SELECT COUNT(*) as count \
                            FROM student_applications \
                            WHERE student_id = $1 \
                            AND application_status = 'true'", [studentId]);
  } catch (error) {
    throw Error('Error while fetching student applications');
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

const getCommentByStudentIdAndSubject = async (studentId, subject) => {
  try {
    const comment = await pool.query("SELECT * FROM comments WHERE student_id = $1 AND comment_subject = $2", [studentId, subject]);

    let isRowEmpty = comment.rows.length === 0;

    if (!isRowEmpty) {
      // Change the date because comment_date was wrong even if timezones seemed correct both in nodejs and db.
      comment.rows[0].comment_date = moment(comment.rows[0].comment_date).format("YYYY-MM-DD HH:mm:ss");
    }

    return comment.rows[0];
  } catch (error) {
    console.log('Error while getting comments ' + error.message);
    throw Error('Error while getting comments');
  }
};

const getAssignmentsByStudentId = async (studentId) => {
  try {
    // assignment status should go in the where clause too
    const assignments = await pool.query("SELECT * FROM internship_assignment \
                                          INNER JOIN atlas_position_group \
                                          ON internship_assignment.position_id = atlas_position_group.atlas_position_id \
                                          INNER JOIN atlas_provider \
                                          ON atlas_position_group.provider_id = atlas_provider.atlas_provider_id \
                                          WHERE internship_assignment.student_id = $1", [studentId]);

    return assignments.rows;
  } catch (error) {
    console.log('Error while getting assignments ' + error.message);
    throw Error('Error while getting assignments');
  }
};

const updateStudentDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4 WHERE sso_uid = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentContractDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE sso_uid = $4",
      [student.ssn, student.doy, student.iban, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentBio = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users " +
      "SET " +
      "education = $1, experience = $2, languages = $3, computer_skills = $4, other_edu = $5, honors = $6, interests = $7, skills = $8 WHERE sso_uid = $9",
      [student.education, student.experience, student.languages, student.computer_skills, student.other_edu, student.honors, student.interests, student.skills, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students bio');
  }
};

const updateStudentContact = async (student, id) => {
  try {
    let updateResults = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6 WHERE sso_uid = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]);

    updateResults = await pool.query("UPDATE sso_users SET mail = $1 WHERE uuid = $2", [student.mail, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating contact details from students');
  }
};

const updateStudentSpecialDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "military_training= $1, working_state= $2, amea_cat= $3 WHERE sso_uid = $4",
      [student.military_training, student.working_state, student.amea_cat, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating special details from students');
  }
};

// untested and not used
const updateStudentEntrySheet = async (form, studentId) => {
  try {
    const updateResults = await pool.query("UPDATE entry_form \
     SET " + '"A1_1" = $1, "A1_2" = $2, "A1_3" = $3, "A2_0" = $4, "A2_1" = $5, "A2_2" = $6, "A2_3" = $7, "A2_4" = $8, ' +
      '"A2_5" = $9, "A2_6" = $10, "A2_7" = $11, "A3_1" = $12, "A3_2" = $13, "A3_3" = $14, "A3_4" = $15, "A4_1" = $16, "A5_1" = $17, ' +
      '"A6_1" = $18, "A6_2" = $19, "A6_3" = $20, "A6_4" = $21, "A6_5" = $22, "B1_1" = $23, "B1_2" = $24, "B1_3" = $25, "B1_4" = $26, ' +
      '"B1_5" = $27, "B1_6" = $28, "B1_7" = $29, "B2_1" = $30, "B2_2" = $31, "B2_3" = $32, "B2_4" = $33, "B2_5" = $34, "B2_6" = $35, ' +
      '"B2_7" = $36, "B2_8" = $37, "C1_1" = $38, "C1_2" = $39, "C1_3" = $40, "C1_4" = $41, "C1_5" = $42, "C1_6" = $43, "C1_7" = $44, ' +
      '"C1_8" = $45, "C1_9" = $46, "C1_10" = $47, "C1_11" = $48' +
      " WHERE student_id = $17 ",
      ['false', 'false', 'false', form.A2_0, form.A2_1, form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6,
        form.A2_7, form.A3_1, form.A3_2, form.A3_3, form.A3_4, form.A4_1, form.A5_1, form.A6_1, form.A6_2, form.A6_3,
        form.A6_4, form.A6_5, form.B1_1, form.B1_2, form.B1_3, form.B1_4, form.B1_5, form.B1_6, form.B1_7, form.B2_1,
        form.B2_2, form.B2_3, form.B2_4, form.B2_5, form.B2_6, form.B2_7, form.B2_8, form.C1_1, form.C1_2, form.C1_3,
        form.C1_4, form.C1_5, form.C1_6, form.C1_7, form.C1_8, form.C1_9, form.C1_10, form.C1_11, studentId]);
    return updateResults;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students entry form');
  }
};

const updatePhase = async (phase, studentId) => {
  try {
    console.log("phase = " + phase);
    const insertResults = await pool.query("UPDATE student_users \
                                            SET phase = $1 WHERE sso_uid = $2 ", [phase, studentId]);
    return insertResults;
  } catch (error) {
    console.log('Error while updating students phase' + error.message);
    throw Error('Error while updating students phase');
  }
};

const insertStudentEntrySheet = async (form, studentId) => {
  try {
    const insertResults = await pool.query("INSERT INTO entry_form" +
      ' ("A1_1", "A1_2", "A1_3", "A2_0", "A2_1", "A2_2", "A2_3", "A2_4", "A2_5", "A2_6", "A2_7", "A3_1", "A3_2", "A3_3", "A3_4", "A4_1", "A5_1", "A6_1", "A6_2",' +
      ' "A6_3", "A6_4", "A6_5", "B1_1", "B1_2", "B1_3", "B1_4", "B1_5", "B1_6", "B1_7", "B2_1", "B2_2", "B2_3", "B2_4", "B2_5", "B2_6", "B2_7", "B2_8", "C1_1",' +
      ' "C1_2", "C1_3", "C1_4", "C1_5", "C1_6", "C1_7", "C1_8", "C1_9", "C1_10", "C1_11", student_id) ' +
      ' VALUES ' + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, \
        $42, $43, $44, $45, $46, $47, $48, $49)',
      ['false', 'false', 'false', form.A2_0, form.A2_1, form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6,
        form.A2_7, form.A3_1, form.A3_2, form.A3_3, form.A3_4, form.A4_1, form.A5_1, form.A6_1, form.A6_2, form.A6_3,
        form.A6_4, form.A6_5, form.B1_1, form.B1_2, form.B1_3, form.B1_4, form.B1_5, form.B1_6, form.B1_7, form.B2_1,
        form.B2_2, form.B2_3, form.B2_4, form.B2_5, form.B2_6, form.B2_7, form.B2_8, form.C1_1, form.C1_2, form.C1_3,
        form.C1_4, form.C1_5, form.C1_6, form.C1_7, form.C1_8, form.C1_9, form.C1_10, form.C1_11, studentId
      ]);
    return insertResults;
  } catch (error) {
    console.log('Error while inserting students entry form' + error.message);
    throw Error('Error while inserting students entry form');
  }
};

const insertStudentEvaluationSheet = async (form, studentId) => {
  try {
    const insertResults = await pool.query("INSERT INTO evaluation_form" +
      '(student_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, comments )' +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
      [studentId, form.q1, form.q2, form.q3, form.q4, form.q5,
        form.q6, form.q7, form.q8, form.q9, form.q10, form.comments
      ]);
    return insertResults;
  } catch (error) {
    console.log('Error while inserting students evaluation form' + error.message);
    throw Error('Error while inserting students evaluation form');
  }
};

const insertStudentApplication = async (body, studentId) => {
  try {
    const periodId = await getPeriodIdByStudentId(studentId);

    if (periodId == -1)
      throw Error('No period was found');

    await pool.query("INSERT INTO student_applications" +
      '(student_id, positions, application_date, application_status, period_id )' +
      " VALUES " + "($1, $2, now(), 'true', $3)",
      [studentId, body, periodId]);
  } catch (error) {
    console.log('Error while inserting application to student_applications' + error.message);
    throw Error('Error while inserting application to student_applications' + error.message);
  }
};

const getPeriodIdByStudentId = async (studentId) => {
  try {
    const depManagerId = await pool.query("SELECT period.id \
                                           FROM period \
                                           INNER JOIN sso_users usr \
                                           ON usr.uuid = period.sso_user_id \
                                           WHERE usr.department_id = $1 \
                                           AND period.is_active = 'true'", [studentId]);

    if (depManagerId.rows.length === 0) return -1;

    return depManagerId.rows[0];
  } catch (error) {
    throw Error('Error while finding student max priority');
  }
};

const deleteEntryFormByStudentId = async (studentId) => {
  try {
    const deleteResults = await pool.query("DELETE FROM entry_form WHERE student_id = $1", [studentId]);
    return deleteResults;
  } catch (error) {
    throw Error(`Error while deleting student ( student_id: ${studentId} ) entry form`);
  }
};

const deleteApplicationById = async (applicationId) => {
  try {
    const studentId = (await pool.query("SELECT student_id as stid FROM student_applications WHERE id = $1", [applicationId])).rows[0].stid;
    console.log("stid " + studentId);
    await deletePositionsbyStudentId(studentId);
    const updateResults = await pool.query("UPDATE student_applications SET application_status='false' WHERE id = $1", [applicationId]);

    return updateResults;
  } catch (error) {
    throw Error(`Error while updating application status to inactive ${applicationId} student_applications`);
  }
};

const deletePositionsbyStudentId = async (studentId) => {
  try {
    await pool.query("DELETE FROM student_positions WHERE student_id = $1", [studentId]);
  } catch (error) {
    throw Error(`Error while deleting positions before setting app status to inactive`);
  }
};

// untested and not used
const updateStudentExitSheet = async (form, studentId) => {
  try {
    const updateResults = await pool.query("UPDATE student_users " +
      "SET " +
      "A1_1 = $2, A2_1 = $3, A2_2 = $4, A2_3 = $5, A2_4 = $6, A2_5 = $7, A2_6 = $8, A2_7 = $9, A2_8 = $10, A3_1 = $11, A3_2 = $12, A3_3 = $13, A4_1 = $14, A5_1 = $15, " +
      "A6_1 = $16, A6_2 = $17, A6_3 = $18, B1_1 = $19, B1_2 = $20, B1_3 = $21, B1_4 = $22, B1_5 = $23, B1_6 = $24, B1_7 = $25, B1_8 = $26, C1_1 = $27 " +
      "WHERE student_id = $1 ",
      [studentId,
        form.A1_1, form.A2_1, form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A2_7, form.A2_8,
        form.A3_1, form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.A6_2, form.A6_3,
        form.B1_1, form.B1_2, form.B1_3, form.B1_4, form.B1_5, form.B1_6, form.B1_7, form.B1_8, form.C1_1
      ]);
    return updateResults;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students exit form');
  }
};

const insertStudentExitSheet = async (form, studentId) => {
  console.log(form);
  try {
    const insertResults = await pool.query('INSERT INTO exit_form' +
      '(student_id, "A1_1", "A1_2", "A1_3", "A1_4", "A2_1", "A2_2", "A2_3", "A2_4", "A2_5", "A2_6", ' +
      '"A2_7", "A2_8", "A3_1", "A3_2", "A3_3", "A3_4", "A4_1", "A5_1", "A5_2", "A5_3", ' +
      '"A5_4", "A5_5", "A5_6", "A5_7", "A5_8", "B1_1")' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)',
      [studentId,
        form.A1_1, form.A1_2, form.A1_3, form.A1_4, form.A2_1, form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6,
        form.A2_7, form.A2_8, form.A3_1, form.A3_2, form.A3_3, form.A3_4, form.A4_1, form.A5_1, form.A5_2, form.A5_3,
        form.A5_4, form.A5_5, form.A5_6, form.A5_7, form.A5_8, form.B1_1,
      ]);
    return insertResults;
  } catch (error) {
    console.log('Error while inserting students exit form' + error.message);
    throw Error('Error while inserting students exit form');
  }
};

const updateStudentPositionPriorities = async (positionPriority, body) => {
  try {
    const updateResults = await pool.query("UPDATE student_positions \
     SET priority = priority - 1" +
      " WHERE priority > $1 AND student_id = $2",
      [positionPriority, body.student_id]);
    return updateResults;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students positions priorities');
  }
};

// Not currently used, real time deletion on student application table
//
// const deletePositionByStudentId = async (positionPriority) => {
//   try {
//     const deleteResults = await pool.query("DELETE FROM student_positions WHERE priority = $1", [positionPriority]);
//     return deleteResults;
//   } catch (error) {
//     throw Error(`Error while deleting student position ( student_id: ${positionPriority} )`);
//   }
// };

const deletePositionsByStudentId = async (studentId) => {
  try {
    const deleteResults = await pool.query("DELETE FROM student_positions WHERE student_id = $1", [studentId]);
    return deleteResults;
  } catch (error) {
    throw Error(`Error while deleting student position ( student_id: ${studentId} )`);
  }
};

const updateStudentPositions = async (studentId, body) => {
  try {
    await deletePositionsByStudentId(studentId);
    for (let i = 0; i < body.length; i++) {
      await insertStudentPositions(studentId, body[i]);
    }
  } catch (error) {
    throw Error('Error while updating student positions-' + error);
  }
};

const insertStudentPositions = async (studentId, body) => {
  try {
    // console.log(body);
    await pool.query("INSERT INTO student_positions (student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [studentId, body.priority, body.company, body.title, body.place, body.upload_date, body.position_id, body.afm, body.internal_position_id]);
  } catch (error) {
    throw Error('Error while inserting student positions ' + body.position_id + "|" + error);
  }
};

const insertStudentPositionsFromUser = async (studentId, positionId, priority, atlas) => {
  try {
    // with one complicated query
    // SELECT name as company, afm, title, city, last_update_string;
    // FROM
    //   (SELECT * FROM atlas_position_group UNION SELECT * FROM internal_position_group) pos
    //    INNER JOIN atlas_provider prov
    //    ON pos.provider_id = prov.atlas_provider_id OR(pos.atlas_position_id IS NULL AND pos.provider_id = prov.id);
    // WHERE(pos.atlas_position_id IS NULL AND pos.id = 1) OR pos.atlas_position_id = 1
    // let positionInfo = null;

    // if (atlas) {
    //   positionInfo = await pool.query("SELECT name as company, afm, title, city, last_update_string FROM atlas_position_group pos" +
    //     " INNER JOIN atlas_provider prov" +
    //     " ON pos.provider_id = prov.atlas_provider_id" +
    //     " WHERE pos.atlas_position_id = $1", [positionId]);
    // } else {
    //   positionInfo = await pool.query("SELECT name as company, afm, title, city, last_update_string FROM internal_position_group pos" +
    //     " INNER JOIN atlas_provider prov" +
    //     " ON pos.provider_id = prov.id" +
    //     " WHERE pos.id = $1", [positionId]);
    // }


    // the code above is left because this law will very likely change in the future
    // new implementation below without internal positions
    let positionInfo = null;
    positionInfo = await pool.query("SELECT name as company, afm, title, city, last_update_string FROM atlas_position_group pos" +
      " INNER JOIN atlas_provider prov" +
      " ON pos.provider_id = prov.atlas_provider_id" +
      " WHERE pos.atlas_position_id = $1", [positionId]);

    console.log(positionId);

    const res = await findIfPositionExists(studentId, positionId, atlas);

    if (parseInt(res.poscount) > 0) {
      console.log("Already exists");
      throw Error('User has already chosen this position');
    }

    let posId = atlas ? positionId : null;
    let internalPosId = !atlas ? positionId : null;
    // console.log(studentId + "|" + priority + " | " + positionInfo.rows[0].company + " | " + positionInfo.rows[0].title + " | " + positionInfo.rows[0].city + " | " + positionInfo.rows[0].last_update_string + "|" + posId + " | " + positionInfo.rows[0].afm + " | " + internalPosId);
    await pool.query("INSERT INTO student_positions (student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [studentId, priority, positionInfo.rows[0].company, positionInfo.rows[0].title, positionInfo.rows[0].city, positionInfo.rows[0].last_update_string, posId, positionInfo.rows[0].afm, internalPosId]);
  } catch (error) {
    throw Error('Error while inserting student positions from user');
  }
};

const findIfPositionExists = async (studentId, positionId, atlas) => {
  try {
    let queryText = "SELECT COUNT(*) as poscount " +
      " FROM student_positions pos" +
      " WHERE " + (atlas ? "pos.position_id = $1" : "pos.internal_position_id = $1") +
      " AND pos.student_id = $2";

    const positionInfo = await pool.query(queryText, [positionId, studentId]);

    return positionInfo.rows[0];
  } catch (error) {
    throw Error('Error while position exists positions');
  }
};

const findMaxPositions = async (studentId, positionId) => {
  let maxPriority = 0;
  try {
    // const maxPriority = await pool.query("SELECT MAX(priority) as maxpriority FROM student_positions WHERE student_id = $1 AND position_id = $2",
    //   [studentId, positionId]);
    const maxPriority = await pool.query("SELECT MAX(priority) as maxpriority FROM student_positions WHERE student_id = $1",
      [studentId]);

    return maxPriority.rows[0].maxpriority;
  } catch (error) {
    if (!maxPriority) return 0;
    throw Error('Error while finding student max priority');
  }
};

const getPhase = async (studentId, positionId) => {
  let maxPriority = 0;
  try {
    const depManagerId = await pool.query("SELECT prd.*, positions \
                                           FROM period prd \
                                           INNER JOIN sso_users usr \
                                           ON usr.uuid = prd.sso_user_id \
                                           LEFT JOIN espa_positions \
                                           ON espa_positions.department_id = prd.department_id \
                                           WHERE usr.department_id = $1 \
                                           AND usr.edupersonprimaryaffiliation = 'faculty' \
                                           AND prd.is_active = 'true'", [studentId]);

    return depManagerId.rows[0];
  } catch (error) {
    if (!maxPriority) return 0;
    throw Error('Error while finding student max priority');
  }
};

const insertOrUpdateMetadataBySSOUid = async (studentId, docType, filePath, fileName, fileExtension) => {
  try {
    const filesData = await getFileMetadataByStudentId(studentId, docType);

    if (!MiscUtils.FILE_TYPES.includes(fileExtension)) {
      return 'Incorrect File Type';
    }

    if (filesData.rowCount != 0) {
      await updateFileDataBySSOUid(studentId, docType, filePath, fileName, fileExtension);
    } else {
      await insertFileMetadataBySSOUid(studentId, docType, filePath, fileName, fileExtension);
    }

  } catch (error) {
    throw Error("Error while inserting file data for: " + docType + " student: " + studentId);
  }
};

const insertFileMetadataBySSOUid = async (studentId, docType, filePath, fileName) => {
  console.log("to be inserted " + docType);
  try {
    await pool.query("INSERT INTO sso_user_files(sso_uid, file_name, file_path, doc_type, date_uploaded) \
                      VALUES ($1, $2, $3, $4, now())", [studentId, fileName, filePath, docType]);
  } catch (error) {
    throw Error("Error while updating file data for: " + docType + " student: " + studentId);
  }
};

const updateFileDataBySSOUid = async (studentId, docType, filePath, fileName) => {
  console.log("to be updated " + docType);
  try {
    await pool.query("UPDATE sso_user_files SET file_name = $1, file_path = $2, date_uploaded = now() \
    WHERE sso_uid = $3 AND doc_type = $4", [fileName, filePath, studentId, docType]);
  } catch (error) {
    throw Error("Error while updating file data for: " + docType + " student: " + studentId);
  }
};

const acceptAssignment = async (assignmentData) => {
  const APPROVAL_STATE = 1;
  const REJECTION_STATE = -1;
  try {
    await pool.query("UPDATE internship_assignment SET approval_state = $1 WHERE student_id = $2 AND position_id = $3",
      [APPROVAL_STATE, assignmentData.student_id, assignmentData.position_id]);
    await pool.query("UPDATE internship_assignment SET approval_state = $1 WHERE student_id = $2 AND position_id <> $3",
      [REJECTION_STATE, assignmentData.student_id, assignmentData.position_id]);
  } catch (error) {
    throw Error('Error while updating student assignments' + error.message);
  }
};

const mergedDepartmentResultFound = async (student_id) => {
  try {
    const result = await pool.query("SELECT * FROM merged_departments_rel WHERE student_id = $1", [student_id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while fetching merged departments: ${error}`);
  }
};

const updateMergedDepartmentDetails = async (studentId, studentData) => {
  const { departmentId, isStudyProgramUpgraded, currentStudyProgram } = studentData;
  const queryText = `UPDATE merged_departments_rel
                      SET department_id = $1, is_study_program_upgraded = $2, current_study_program = $3
                      WHERE student_id = $4`;
  const values = [departmentId, isStudyProgramUpgraded, currentStudyProgram, studentId];
  try {
    await pool.query(queryText, values);
    console.log(`Record with studentId ${studentId} updated successfully`);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while updating merged departments record: ${error}`);
  }
};

const insertMergedDepartmentDetails = async (studentId, studentData) => {
  const { departmentId, isStudyProgramUpgraded, currentStudyProgram } = studentData;
  const queryText = "INSERT INTO merged_departments_rel (student_id, department_id, is_study_program_upgraded, current_study_program) \
                      VALUES ($1, $2, $3, $4)";
  const values = [studentId, departmentId, isStudyProgramUpgraded, currentStudyProgram];
  try {
    await pool.query(queryText, values);
    console.log("Record added successfully");
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while adding merged departments record: ${error}`);
  }
};


const checkUserAcceptance = async (userId) => {
  try {
    const result = await pool.query("SELECT accepted FROM terms_accepted WHERE sso_user_id = $1", [userId]);

    if (result.rowCount === 0) {
      return false;
    } else if (!result.rows[0].accepted) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while checking user acceptance: ${error}`);
  }
};

const insertUserAcceptance = async (userId, areTermsAccepted) => {
  try {
    await pool.query("INSERT INTO terms_accepted (sso_user_id, accepted, acceptance_datetime) \
      VALUES($1, $2, NOW())", [userId, areTermsAccepted]);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while inserting user acceptance: ${error}`);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentEntrySheets,
  getStudentExitSheets,
  getStudentEvaluationSheets,
  getStudentApplications,
  getStudentPositions,
  getStudentActiveApplication,
  getPhase,
  getFileMetadataByStudentId,
  getCommentByStudentIdAndSubject,
  getAssignmentsByStudentId,
  findMaxPositions,
  insertStudentEntrySheet,
  insertStudentPositions,
  insertStudentPositionsFromUser,
  insertStudentExitSheet,
  insertStudentEvaluationSheet,
  insertStudentApplication,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentSpecialDetails,
  updateStudentEntrySheet,
  updateStudentPositionPriorities,
  updateStudentPositions,
  updateStudentExitSheet,
  updatePhase,
  deleteEntryFormByStudentId,
  deleteApplicationById,
  deletePositionsByStudentId,
  // dummy login
  loginStudent,
  insertOrUpdateMetadataBySSOUid,
  acceptAssignment,
  mergedDepartmentResultFound,
  insertMergedDepartmentDetails,
  updateMergedDepartmentDetails,
  checkUserAcceptance,
  insertUserAcceptance
};
