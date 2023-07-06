// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const moment = require('moment');
const atlasController = require("../controllers/atlasController.js");
require('dotenv').config();

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

    if (process.env.ENV == 'DEV') {
      return {
        'Grade': 6.7, 'Ects': 160, 'Semester': 7, 'Praktiki': 0, 'CourseCount': 32
      };
    }

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
    const resultsSSOUsers = await pool.query("SELECT sso_users.*, student_users.*, atlas_academics.department FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              INNER JOIN atlas_academics ON sso_users.department_id = atlas_academics.atlas_id \
                                              WHERE sso_users.uuid = $1", [id]);
    // const student = resultsSSOUsers.rows;
    // return student;
    const student = resultsSSOUsers.rows[0];

    let departmentFieldForProcedure = student.department_id;
    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (student.department_id.toString().length == 6) {
      departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(student.department_id);
    }

    const studentDetailsProcedure = await getStudentsSecretaryDetails(departmentFieldForProcedure, student.schacpersonaluniquecode);
    let studentDetails = Object.assign(student, studentDetailsProcedure);
    return [studentDetails];
  } catch (error) {
    throw Error('Error while fetching students' + error.message);
  }
};

const getStudentFilesForAppPrint = async (studentId) => {
  try {
    const result = await pool.query('SELECT doc_type FROM sso_user_files WHERE sso_uid = $1', [studentId]);
    return result.rows;
  } catch (error) {
    console.error(error);
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
    return await pool.query("SELECT id, student_id, positions, to_char(\"application_date\", 'DD/MM/YYYY') as application_date, application_status, protocol_number \
                            FROM student_applications \
                            WHERE student_id = $1 ORDER BY application_status, protocol_number", [studentId]);
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
    const assignments = await pool.query(`SELECT * FROM internship_assignment
                                          INNER JOIN atlas_position_group
                                          ON internship_assignment.position_id = atlas_position_group.atlas_position_id
                                          INNER JOIN atlas_provider
                                          ON atlas_position_group.provider_id = atlas_provider.atlas_provider_id
                                          INNER JOIN semester_interest_apps
                                          ON internship_assignment.student_id = semester_interest_apps.student_id
                                          AND internship_assignment.period_id = semester_interest_apps.period_id
                                          INNER JOIN period ON period.id = internship_assignment.period_id
                                          AND period.is_active = true
                                          WHERE internship_assignment.student_id = $1`, [studentId]);

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
     SET " + "ssn = $1, doy = $2, iban = $3, id_card = $4 WHERE sso_uid = $5",
      [student.ssn, student.doy, student.iban, student.id_card, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentExtraContractDetails = async (student, id) => {
  try {
    console.log(student);
    console.log(id);
    const updateResults = await pool.query("UPDATE student_users \
     SET ama_number = $1, id_card = $2 WHERE sso_uid = $3",
      [student.ama_number, student.id_card, id]
    );

    return updateResults;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while updating students contract details');
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

    if (student.mail)
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
     SET " + '"A0_1" = $1, "A0_2" = $2, "A1" = $3, "A1_1" = $4, "A1_2" = $5, "A2" = $6, "A2_1" = $7, "A2_1_1" = $8, "A2_1_2" = $9, "A2_1_3" = $10, "A2_1_4" = $11, ' +
      '"A2_1_5" = $12, "A2_1_6" = $13, "A2_2" = $14, "A2_2_1" = $15, "A2_2_2" = $16, "A2_2_3" = $17, "A2_3" = $18, "A2_4" = $19, "A3" = $20, "A3_1" = $21, "A3_1_1" = $22, "A3_1_2" = $23, ' +
      '"A3_2" = $24, "B" = $25, "B1" = $26, "B2" = $27, "B3" = $28, "B4" = $29, "B5" = $30, "B6" = $31, "C1" = $32, "C2" = $33, "C3" = $34, "C4" = $35, "C5" = $36, "C6" = $37, ' +
      '"C7" = $38, "C8" = $39, "C9" = $40, "D4" = $41, "D5" = $42, "D6" = $43, "D7" = $44, "D8" = $45, "D9" = $46, "D10" = $47, "D11" = $48, "D12" = $49, "D13" = $50, "D14" = $51, creation_date=NOW(), ops_number_eisodou = null' +
      " WHERE student_id = $52 ",
      [form.A0_1, form.A0_2, 'false', 'false', 'false', form.A2, form.A2_1,
      form.A2_1_1, form.A2_1_2, form.A2_1_3, form.A2_1_4, form.A2_1_5, form.A2_1_6, form.A2_2, form.A2_2_1,
      form.A2_2_2, form.A2_2_3, form.A2_3, form.A2_4, form.A3, form.A3_1, form.A3_1_1, form.A3_1_2, form.A3_2, form.B,
      form.B1, form.B2, form.B3, form.B4, form.B5, form.B6, form.C1, form.C2, form.C3, form.C4, form.C5,
      form.C6, form.C7, form.C8, form.C9, form.D4, form.D5, form.D6, form.D7, form.D8, form.D9, form.D10,
      form.D11, form.D12, form.D13, form.D14, studentId]);
    return updateResults;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students entry form');
  }
};

const updatePhase = async (phase, studentId) => {
  try {
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
      ' ("A0_1", "A0_2", "A1", "A1_1", "A1_2", "A2", "A2_1", "A2_1_1", "A2_1_2", "A2_1_3", "A2_1_4", "A2_1_5", "A2_1_6", "A2_2", "A2_2_1", "A2_2_2", "A2_2_3", "A2_3", "A2_4", "A3",' +
      ' "A3_1", "A3_1_1", "A3_1_2", "A3_2", "B", "B1", "B2", "B3", "B4", "B5", "B6", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "D4", "D5", "D6", "D7", "D8",' +
      ' "D9", "D10", "D11", "D12", "D13", "D14", creation_date, student_id, ops_number_eisodou) ' +
      ' VALUES ' + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, \
        $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, NOW(), $52, null)',
      [form.A0_1, form.A0_2, 'false', 'false', 'false', form.A2, form.A2_1,
      form.A2_1_1, form.A2_1_2, form.A2_1_3, form.A2_1_4, form.A2_1_5, form.A2_1_6, form.A2_2, form.A2_2_1,
      form.A2_2_2, form.A2_2_3, form.A2_3, form.A2_4, form.A3, form.A3_1, form.A3_1_1, form.A3_1_2, form.A3_2, form.B,
        'false', 'false', 'false', form.B4, 'false', 'false', 'false', 'false', 'false', form.C4, form.C5,
      form.C6, form.C7, form.C8, form.C9, form.D4, form.D5, form.D6, form.D7, form.D8, form.D9, form.D10,
      form.D11, form.D12, form.D13, form.D14, studentId]);
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
    const details = await getPeriodAndProtocolNumberByStudentId(studentId);

    if (details.periodId == -1)
      throw Error('No period was found');

    const result = await pool.query("INSERT INTO student_applications" +
      "(student_id, positions, application_date, application_status, period_id, protocol_number)" +
      " VALUES " + "($1, $2, now(), $3, $4, $5)" +
      " RETURNING id",
      [studentId, body, true, details.periodId, details.protocolNumber]);
    const applicationId = result.rows[0].id;

    for (const obj of body) {
      console.log(obj.upload_date);
      obj.upload_date = moment(obj.upload_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      await pool.query("INSERT INTO final_app_positions" +
        "(student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id, application_id)" +
        " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [studentId, obj.priority, obj.company, obj.title, obj.place, obj.upload_date, obj.position_id, obj.afm, obj.internal_position_id, applicationId]);
    }

  } catch (error) {
    console.log('Error while inserting application to student_applications ' + error.message + ' for student ' + studentId);
    throw Error('Error while inserting application to student_applications' + error.message);
  }
};

const getPeriodAndProtocolNumberByStudentId = async (studentId) => {
  try {
    const depManagerId = await pool.query("SELECT period.id, apps.protocol_number FROM period \
                                          INNER JOIN sso_users ON sso_users.department_id = period.department_id \
                                          INNER JOIN semester_interest_apps apps ON apps.period_id = period.id AND student_id = $1 \
                                          WHERE sso_users.uuid = $1 \
                                          AND period.is_active = 'true'", [studentId]);

    if (depManagerId.rows.length === 0) return { periodId: -1, protocolNumber: -1 };

    return { periodId: depManagerId.rows[0].id, protocolNumber: depManagerId.rows[0].protocol_number };
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
    const updateResults = await pool.query('UPDATE student_users ' +
      'SET ' +
      '"A1" = $2, "A2" = $3, "A2_0" = $4, "A2_1" = $5, "A2_1_1" = $6, "A2_1_2" = $7, "A2_1_3" = $8, "A2_1_4" = $9, "A2_1_5" = $10, ' +
      '"A2_1_6" = $11, "A2_2" = $12, "A2_2_1" = $13, "A2_2_2" = $14, "A2_2_3" = $15, "A2_3" = $16, "A2_4" = $17, "A3" = $18, ' +
      '"A3_1" = $19, "A3_2" = $20, "B" = $21, "B0" = $22, "B1" = $23, "B2" = $24, "B3" = $25, "B4" = $26, "B5" = $27, "B6" = $28, ' +
      '"E1" = $29, "E2" = $30, "E2_1" = $31, "E2_2" = $32, "E2_3" = $33, "E3" = $34, "E3_1" = $35, "E3_2" = $36, "E3_3" = $37, ' +
      '"E4" = $38, "E4_1" = $39, "E4_2" = $40, "E4_3" = $41, "E5" = $42, "E5_1" = $43, "E5_2" = $44, "E5_3" = $45, creation_date=NOW() ' +
      'WHERE student_id = $1 ',
      [studentId,
        form.A1, form.A2, form.A2_0, form.A2_1, form.A2_1_1, form.A2_1_2, form.A2_1_3, form.A2_1_4, form.A2_1_5,
        form.A2_1_6, form.A2_2, form.A2_2_1, form.A2_2_2, form.A2_2_3, form.A2_3, form.A2_4, form.A3, form.A3_1, form.A3_2,
        form.B, form.B0, form.B1, form.B2, form.B3, form.B4, form.B5, form.B6, form.E1, form.E2, form.E2_1, form.E2_2, form.E2_3, form.E3,
        form.E3_1, form.E3_2, form.E3_3, form.E4, form.E4_1, form.E4_2, form.E4_3, form.E5, form.E5_1, form.E5_2, form.E5_3
      ]);
    return updateResults;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students exit form');
  }
};

const insertStudentExitSheet = async (form, studentId) => {
  // console.log(form);
  try {
    const insertResults = await pool.query('INSERT INTO exit_form' +
      '(student_id, "A1", "A2", "A2_0", "A2_1", "A2_1_1", "A2_1_2", "A2_1_3", "A2_1_4", "A2_1_5",' +
      '"A2_1_6", "A2_2", "A2_2_1", "A2_2_2", "A2_2_3", "A2_3", "A2_4", "A3", "A3_1", "A3_2", ' +
      '"B", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "E1", "E2", "E2_1", "E2_2", "E2_3", "E3", ' +
      '"E3_1", "E3_2", "E3_3", "E4", "E4_1", "E4_2", "E4_3", "E5", "E5_1", "E5_2", "E5_3", creation_date)' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
        $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, NOW())',
      [studentId,
        form.A1, form.A2, form.A2_0, form.A2_1, form.A2_1_1, form.A2_1_2, form.A2_1_3, form.A2_1_4, form.A2_1_5,
        form.A2_1_6, form.A2_2, form.A2_2_1, form.A2_2_2, form.A2_2_3, form.A2_3, form.A2_4, form.A3, form.A3_1, form.A3_2,
        form.B, form.B0, form.B1, form.B2, form.B3, form.B4 ?? "true", form.B5, form.B6, form.E1, form.E2, form.E2_1, form.E2_2, form.E2_3, form.E3,
        form.E3_1, form.E3_2, form.E3_3, form.E4, form.E4_1, form.E4_2, form.E4_3, form.E5, form.E5_1, form.E5_2, form.E5_3
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
    const formattedUploadDate = moment(body.upload_date, "DD/MM/YYYY").format("YYYY-MM-DD");

    await pool.query("INSERT INTO student_positions (student_id, priority, company, title, place, upload_date, position_id, afm, internal_position_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [studentId, body.priority, body.company, body.title, body.place, formattedUploadDate, body.position_id, body.afm, body.internal_position_id]);
  } catch (error) {
    throw Error('Error while inserting student position ' + body.position_id + "|" + error);
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

const getPhase = async (departmentId) => {
  try {
    // const depManagerId = await pool.query("SELECT prd.*, positions \
    //                                        FROM period prd \
    //                                        INNER JOIN sso_users usr \
    //                                        ON usr.uuid = prd.sso_user_id \
    //                                        LEFT JOIN espa_positions \
    //                                        ON espa_positions.department_id = prd.department_id \
    //                                        WHERE usr.department_id = $1 \
    //                                        AND usr.edupersonprimaryaffiliation = 'faculty' \
    //                                        AND prd.is_active = 'true'", [departmentId]);
    const depManagerId = await pool.query("SELECT prd.*, positions \
                                           FROM period prd \
                                           LEFT JOIN espa_positions \
                                           ON espa_positions.department_id = prd.department_id \
                                           WHERE prd.department_id = $1 \
                                           AND prd.is_active = 'true'", [departmentId]);

    return depManagerId.rows[0];
  } catch (error) {
    throw Error('Error while getting phase for departments' + error.message);
  }
};

const getMergedDepartmentInfoByStudentId = async (studentId) => {
  try {
    // const departmentFetched = await pool.query("SELECT sso_users.department_id \
    //                                             FROM sso_users  \
    //                                             WHERE sso_users.uuid = $1", [studentId]);
    // const departmentIdFull = departmentFetched.rows[0].department_id;
    // if (MiscUtils.isMergedDepartment(departmentIdFull).isMerged) {
    //   await pool.query("UPDATE sso_users SET department_id = $1 \
    //                     WHERE sso_users.uuid = $2", [MiscUtils.isMergedDepartment(departmentIdFull).departmentId, studentId]);
    // }
    const departments = await pool.query(" SELECT deps.* \
                                            FROM atlas_academics deps \
                                            JOIN sso_users \
                                            ON LEFT(deps.atlas_id:: text, LENGTH(sso_users.department_id:: text)) = sso_users.department_id:: text \
                                            WHERE sso_users.uuid = $1", [studentId]);

    return departments.rows;
  } catch (error) {
    throw Error('Error while getting phase for merged departments' + error.message);
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

const acceptAssignment = async (assignmentData, assignedPositionId = 0) => {
  const APPROVAL_STATE = 1;
  const REJECTION_STATE = -1;
  try {
    // assignmentData.position_id is the group id whereas assignedPositionId is the new position id after preassign
    await pool.query("UPDATE internship_assignment SET approval_state = $1, assigned_position_id = $2 WHERE student_id = $3 AND position_id = $4",
      [APPROVAL_STATE, assignedPositionId, assignmentData.student_id, assignmentData.position_id]);
    await pool.query("UPDATE internship_assignment SET approval_state = $1 WHERE student_id = $2 AND position_id <> $3",
      [REJECTION_STATE, assignmentData.student_id, assignmentData.position_id]);
  } catch (error) {
    console.error('Error while updating student assignments' + error.message);
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
  const { departmentId, isStudyProgramUpgraded, currentStudyProgram, studyProgramId } = studentData;
  const queryText = `UPDATE merged_departments_rel
                      SET department_id = $1, is_study_program_upgraded = $2, current_study_program = $3, study_program_id = $4
                      WHERE student_id = $5`;
  const values = [departmentId, isStudyProgramUpgraded, currentStudyProgram, studyProgramId, studentId];
  try {
    await pool.query(queryText, values);
    console.log(`Record with studentId ${studentId} updated successfully`);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while updating merged departments record: ${error}`);
  }
};

const insertMergedDepartmentDetails = async (studentId, studentData) => {
  const { departmentId, isStudyProgramUpgraded, currentStudyProgram, studyProgramId } = studentData;
  const queryText = "INSERT INTO merged_departments_rel (student_id, department_id, is_study_program_upgraded, current_study_program, study_program_id) \
                      VALUES ($1, $2, $3, $4, $5)";
  const values = [studentId, departmentId, isStudyProgramUpgraded, currentStudyProgram, studyProgramId];
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

const insertOrUpdateStudentInterestApp = async (studentId, body, oldAppId = "", mode) => {
  try {
    const APP_INITIAL_STATUS = 1;
    // get the current date in the format of DDMMYYYY
    const applicationDate = new Date();
    const date = moment().format('DD-MM-YYYY');

    if (mode == "update") {
      // concatenate the date and id
      const protocolNumber = oldAppId + '/' + date;

      // update the data into the table
      await pool.query("UPDATE semester_interest_apps SET interest_app_date = $1, protocol_number = $2 WHERE interest_app_id = $3",
        [applicationDate, protocolNumber, oldAppId]);

      console.log('Data updated successfully');
      return;
    }

    // insert the data into the table
    const result = await pool.query("INSERT INTO semester_interest_apps(student_id, interest_app_date, interest_app_status, period_id) \
    VALUES($1, $2, $3, $4) RETURNING interest_app_id ",
      [studentId, applicationDate, APP_INITIAL_STATUS, body.periodId]);

    const newAppId = result.rows[0].interest_app_id;
    // concatenate the date and id
    const protocolNumber = newAppId + '/' + date;

    await pool.query("UPDATE semester_interest_apps SET protocol_number = $1 WHERE interest_app_id = $2", [protocolNumber, newAppId]);

    console.log('Data inserted successfully');
  } catch (error) {
    console.log(error);
    throw Error('Error while inserting or updating data into semester_interest_apps' + error.message);
  }
};

const semesterInterestAppFound = async (studentId, periodId) => {
  try {
    const result = await pool.query("SELECT * FROM semester_interest_apps WHERE student_id = $1 AND period_id = $2", [studentId, periodId]);
    const appId = !result.rows[0]?.interest_app_id ? "" : result.rows[0].interest_app_id;
    return { found: result.rowCount > 0, appId: appId };
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while fetching semester interest app: ${error}`);
  }
};

const getSemesterProtocolNumberIfExistsOrNull = async (studentId, periodId) => {
  try {
    const result = await pool.query("SELECT protocol_number FROM semester_interest_apps WHERE student_id = $1 AND period_id = $2", [studentId, periodId]);
    const protocolNumber = !result.rows[0]?.protocol_number ? "" : result.rows[0].protocol_number;
    return { found: result.rowCount > 0, protocolNumber: protocolNumber };
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while fetching semester interest app protocol number: ${error}`);
  }
};

const updateDepartmentIdByStudentId = async (studentId, departmentId) => {
  try {
    await pool.query("UPDATE sso_users SET department_id = $1 WHERE uuid = $2", [departmentId, studentId]);
    console.log(`Record with studentId ${studentId} updated successfully`);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while updating department id: ${error}`);
  }
};

const getStudentRankedApprovalStatusForPeriod = async (studentId, periodId) => {
  try {
    const students = await pool.query(`SELECT is_approved FROM students_approved_rank
                                       WHERE sso_uid = $1
                                       AND students_approved_rank.period_id = $2`, [studentId, periodId]);
    return students.rows[0].is_approved;
  } catch (error) {
    throw Error('Error while fetching students from phase 2 for this department' + error.message);
  }
};

const getContractFileMetadataByStudentId = async (studentId, periodId) => {
  try {
    const query = `SELECT sign_date as contract_date, pr.name as company_name, pr.afm as company_afm, asn.company_address as company_address,
                  company_liaison, company_liaison_position, displayname, father_name, dept_name, id_card as id_number, ama_number as amika, usr.user_ssn as amka,
                  student_users.ssn as afm, doy as doy_name, pa_subject, pa_subject_atlas, pa_start_date, pa_end_date, department_manager_name,
                  list.ada_number as ada_number, list.apofasi, list.arithmos_sunedriashs, asn.student_fee as student_wages, asn.position_id,
                  asn.ada_number as assignment_ada_number, asn.apofasi as assignment_apofasi, asn.arithmos_sunedriashs as assignment_arithmos_sunedriashs
                  FROM final_assignments_list list
                  INNER JOIN internship_assignment asn ON asn.period_id = list.period_id
                  INNER JOIN sso_users usr ON usr.uuid = asn.student_id
                  INNER JOIN student_users ON usr.uuid = student_users.sso_uid
                  INNER JOIN atlas_position_group grp ON asn.position_id = grp.atlas_position_id
                  INNER JOIN atlas_provider pr on grp.provider_id = pr.atlas_provider_id
                  WHERE list.period_id = $1 AND asn.student_id = $2`;
    const result = await pool.query(query, [periodId, studentId]);

    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while fetching contract file metadata: ${error}`);
  }
};

const getPaymentOrderMetadataByStudentId = async (studentId, periodId) => {
  try {
    const query = `SELECT sign_date as contract_date, usr.displayname, dept_name, pa_start_date, pa_end_date, department_manager_name,
                  list.ada_number as ada_number, list.apofasi, list.arithmos_sunedriashs, asn.student_fee as student_wages,
                  asn.ada_number as assignment_ada_number, asn.apofasi as assignment_apofasi, asn.arithmos_sunedriashs as assignment_arithmos_sunedriashs,
                  usr.schacgender as student_gender, mgr.schacgender as department_manager_gender
                  FROM final_assignments_list list
                  INNER JOIN internship_assignment asn ON asn.period_id = list.period_id
                  INNER JOIN sso_users usr ON usr.uuid = asn.student_id
                  INNER JOIN student_users ON usr.uuid = student_users.sso_uid
                  INNER JOIN period ON period.id = list.period_id
                  INNER JOIN sso_users mgr ON mgr.uuid = period.sso_user_id
                  WHERE list.period_id = $1 AND asn.student_id = $2`;
    const result = await pool.query(query, [periodId, studentId]);
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while fetching contract file metadata: ${error}`);
  }
};

const getContractDetailsByDepartmentAndPeriod = async (departmentId, periodId) => {
  try {
    const query = `SELECT sign_date as contract_date, pr.name as company_name, pr.afm as company_afm, asn.company_address as company_address,
                  company_liaison, company_liaison_position, displayname, father_name, dept_name, id_card as id_number, ama_number as amika, usr.user_ssn as amka,
                  student_users.ssn as afm, doy as doy_name, pa_subject, pa_subject_atlas, pa_start_date, pa_end_date, department_manager_name,
                  list.ada_number as ada_number, list.apofasi, list.arithmos_sunedriashs, asn.student_fee as student_wages, asn.student_id
                  FROM final_assignments_list list
                  INNER JOIN internship_assignment asn ON asn.period_id = list.period_id AND asn.list_id IS NOT NULL
                  INNER JOIN sso_users usr ON usr.uuid =  asn.student_id
                  INNER JOIN student_users ON usr.uuid = student_users.sso_uid
                  INNER JOIN atlas_position_group grp ON asn.position_id = grp.atlas_position_id
                  INNER JOIN atlas_provider pr on grp.provider_id = pr.atlas_provider_id
                  WHERE list.period_id = $1 AND list.department_id = $2`;
    const result = await pool.query(query, [periodId, departmentId]);
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while fetching contract file metadata (by department/period): ${error}`);
  }
};


const isStudentInAssignmentList = async (student_id) => {
  try {
    const result = await pool.query(`SELECT * FROM final_assignments_list list
                                    INNER JOIN internship_assignment asn ON asn.list_id = list.list_id
                                    AND student_id = $1`, [student_id]);

    return result.rows.length > 0;
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while getting student assignment list: ${error.message}`);
  }
};

const updateContractDetails = async (studentId, periodId, contractDetails) => {
  try {
    // console.log(contractDetails);
    const updateStudentUserResult = await pool.query(`UPDATE student_users SET
                                    id_card = $1, ama_number = $2, ssn = $3, father_name = $4, doy = $5
                                    WHERE sso_uid = $6`, [contractDetails.id_number,
    contractDetails.amika, contractDetails.afm, contractDetails.father_name,
    contractDetails.doy_name, studentId]);

    const inputDateFormat = 'YYYY-MM-DD';
    contractDetails.contract_date = !contractDetails.contract_date || !moment(contractDetails.contract_date, inputDateFormat, true).isValid() ? null
      : moment(contractDetails.contract_date, inputDateFormat).format('YYYY-MM-DD');
    contractDetails.pa_start_date = !contractDetails.pa_start_date || !moment(contractDetails.pa_start_date, inputDateFormat, true).isValid() ? null
      : moment(contractDetails.pa_start_date, inputDateFormat).format('YYYY-MM-DD');
    contractDetails.pa_end_date = !contractDetails.pa_end_date || !moment(contractDetails.pa_end_date, inputDateFormat, true).isValid() ? null
      : moment(contractDetails.pa_end_date, inputDateFormat).format('YYYY-MM-DD');

    const updateAssignmentsResult = await pool.query(`UPDATE internship_assignment SET
                                    company_liaison = $1,
                                    company_liaison_position = $2,
                                    company_address = $3,
                                    sign_date = $4,
                                    pa_subject = $5,
                                    pa_subject_atlas = $6,
                                    pa_start_date = $7,
                                    pa_end_date = $8,
                                    student_fee = $9,
                                    apofasi = $10,
                                    arithmos_sunedriashs = $11,
                                    ada_number = $12
                                    WHERE student_id = $13 AND period_id = $14`,
      [contractDetails.company_liaison, contractDetails.company_liaison_position, contractDetails.company_address,
      contractDetails.contract_date, contractDetails.pa_subject, contractDetails.pa_subject_atlas,
      contractDetails.pa_start_date, contractDetails.pa_end_date, contractDetails.student_wages,
      contractDetails.apofasi, contractDetails.arithmos_sunedriashs, contractDetails.ada_number,
        studentId, periodId]);

    const updateFinalListResult = await pool.query(`UPDATE final_assignments_list SET
                                    department_manager_name = $1,
                                    ada_number = COALESCE(ada_number, $2),
                                    apofasi = COALESCE(apofasi, $3),
                                    arithmos_sunedriashs = COALESCE(arithmos_sunedriashs, $4)
                                    WHERE period_id = $5`,
      [contractDetails.department_manager_name, contractDetails.ada_number, contractDetails.apofasi, contractDetails.arithmos_sunedriashs, periodId]);

    console.log(`Record with studentId ${studentId} updated successfully`);
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while updating contract details: ${error.message}`);
  }
};

const updatePaymentOrderDetails = async (studentId, periodId, contractDetails) => {
  try {
    console.log(contractDetails);
    // await pool.query(`UPDATE student_users SET father_name = $1
    //                                 WHERE sso_uid = $2`, [contractDetails.father_name, studentId]);

    const inputDateFormat = 'YYYY-MM-DD';

    contractDetails.pa_start_date = !contractDetails.pa_start_date || !moment(contractDetails.pa_start_date, inputDateFormat, true).isValid() ? null
      : moment(contractDetails.pa_start_date, inputDateFormat).format('YYYY-MM-DD');
    contractDetails.pa_end_date = !contractDetails.pa_end_date || !moment(contractDetails.pa_end_date, inputDateFormat, true).isValid() ? null
      : moment(contractDetails.pa_end_date, inputDateFormat).format('YYYY-MM-DD');

    await pool.query(`UPDATE internship_assignment SET
                                    pa_start_date = $1,
                                    pa_end_date = $2,
                                    student_fee = $3
                                    WHERE student_id = $4 AND period_id = $5`,
      [contractDetails.pa_start_date, contractDetails.pa_end_date, contractDetails.student_wages, studentId, periodId]);

    await pool.query(`UPDATE final_assignments_list SET
                                    department_manager_name = $1
                                    WHERE period_id = $2`,
      [contractDetails.department_manager_name, periodId]);

    console.log(`Record with studentId ${studentId} updated successfully`);
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while updating contract details: ${error.message}`);
  }
};

const updateAssignmentStateByStudentAndPosition = async (studentId, periodId, positionId) => {
  try {
    const COMPLETED_IN_ATLAS = 1;
    await pool.query(`UPDATE internship_assignment
                                        SET status = $1
                                        WHERE student_id = $2 AND period_id = $3 AND assigned_position_id = $4`,
      [COMPLETED_IN_ATLAS, studentId, periodId, positionId]);
  } catch (error) {
    console.error(error.message);
    throw Error('Error while updating assignment state by student and period ids' + error.message);
  }
};

const getLatestPeriodOfAssignedStudent = async (departmentId, studentId) => {
  try {
    const depManagerId = await pool.query(`SELECT MAX(prd.ID) as maxid
                                          FROM period prd
                                          INNER JOIN internship_assignment asn
                                          ON asn.period_id = prd.id
                                          AND prd.department_id = $1 AND student_id = $2`,
      [departmentId, studentId]);

    if (depManagerId.rows.length === 0) {
      return null;
    }

    return depManagerId.rows[0].maxid;
  } catch (error) {
    throw Error('Error while getting phase for departments' + error.message);
  }
};

const isEntrySheetEnabledForStudent = async (studentId) => {
  try {
    const query = `SELECT asn.*
                    FROM internship_assignment asn
                    WHERE asn.student_id = $1`;

    const result = await pool.query(query, [studentId]);

    return result.rows.length > 0;
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while getting student assignment list: ${error.message}`);
  }
};

const isExitSheetEnabledForStudent = async (studentId) => {
  try {
    const query = `SELECT asn.*
                    FROM internship_assignment asn
                    WHERE asn.student_id = $1
                    AND status <> -1
                    AND pa_end_date < NOW()`;

    const result = await pool.query(query, [studentId]);

    return result.rows.length > 0;
  } catch (error) {
    console.error(error.message);
    throw Error(`An error occured while getting student assignment list: ${error.message}`);
  }
};

const getApprovedAssignmentInfoByStudentId = async (studentId) => {
  try {
    const query = `
      SELECT *
      FROM internship_assignment
      WHERE student_id = $1
      AND approval_state = 1`;

    const result = await pool.query(query, [studentId]);

    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching assignment details for student ID ${studentId}: `, error);
    throw Error('Error fetching assignment details.');
  }
};

const updateSheetOpsNumberById = async (id, opsNumber, sheetType) => {
  try {
    let updateResults;
    if (sheetType == 'entry') {
      updateResults = await pool.query(`UPDATE entry_form
                            SET ops_number_eisodou = $1 WHERE id = $2`, [opsNumber, id]);
    } else if (sheetType == 'exit') {
      updateResults = await pool.query(`UPDATE exit_form
                            SET ops_number_exodou = $1 WHERE id = $2`, [opsNumber, id]);
    } else {
      console.error('Invalid sheet type given');
      throw Error('Invalid sheet type given');
    }

    return updateResults;
  } catch (error) {
    console.error('Error while updating sheet number: id ' + id + ' and sheet type ' + sheetType);
    throw Error('Error while updating sheet number: id ' + id + ' and sheet type ' + sheetType);
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
  getStudentRankedApprovalStatusForPeriod,
  getPhase,
  getLatestPeriodOfAssignedStudent,
  getFileMetadataByStudentId,
  getCommentByStudentIdAndSubject,
  getAssignmentsByStudentId,
  getApprovedAssignmentInfoByStudentId,
  getContractFileMetadataByStudentId,
  getPaymentOrderMetadataByStudentId,
  getContractDetailsByDepartmentAndPeriod,
  getMergedDepartmentInfoByStudentId,
  getSemesterProtocolNumberIfExistsOrNull,
  getStudentFilesForAppPrint,
  isStudentInAssignmentList,
  semesterInterestAppFound,
  findMaxPositions,
  mergedDepartmentResultFound,
  checkUserAcceptance,
  isEntrySheetEnabledForStudent,
  isExitSheetEnabledForStudent,
  insertStudentEntrySheet,
  insertStudentPositions,
  insertStudentPositionsFromUser,
  insertStudentExitSheet,
  insertStudentEvaluationSheet,
  insertStudentApplication,
  insertMergedDepartmentDetails,
  insertUserAcceptance,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentExtraContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentSpecialDetails,
  updateStudentEntrySheet,
  updateStudentPositionPriorities,
  updateStudentPositions,
  updateStudentExitSheet,
  updatePhase,
  updateContractDetails,
  updatePaymentOrderDetails,
  updateMergedDepartmentDetails,
  updateDepartmentIdByStudentId,
  updateSheetOpsNumberById,
  updateAssignmentStateByStudentAndPosition,
  deleteEntryFormByStudentId,
  deleteApplicationById,
  deletePositionsByStudentId,
  loginStudent,
  insertOrUpdateMetadataBySSOUid,
  insertOrUpdateStudentInterestApp,
  acceptAssignment
};
