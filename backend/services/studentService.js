// database connection configuration
// const { addSyntheticLeadingComment } = require("typescript");
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');

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
    throw Error('Error while fetching students');
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

const updateStudentEntrySheet = async (form, studentId) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "A1_1 = $1, A1_2 = $2, A1_3 = $3, A2_1 = $4, A2_2 = $5, A2_3 = $6, A2_4 = $7, A2_5 = $8, A2_6 = $9, " +
      "A3_1 = $10, A3_2 = $11, A3_3 = $12, A4_1 = $13, A5_1 = $14, A6_1 = $15, B1_1 = $16" +
      " WHERE student_id = $17 ",
      [form.A1_1, form.A1_2, form.A1_3, form.A2_1,
      form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A3_1,
      form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.B1_1,
        studentId
      ]);
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
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
      [form.A1_1, form.A1_2, form.A1_3, form.A2_1,
      form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A3_1,
      form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.B1_1, studentId
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

    await pool.query("INSERT INTO student_applications" +
      '(student_id, positions, application_date, application_status )' +
      " VALUES " + "($1, $2, now(), 'true')",
      [studentId, body]);
  } catch (error) {
    console.log('Error while inserting application to student_applications' + error.message);
    throw Error('Error while inserting application to student_applications');
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
    const insertResults = await pool.query("INSERT INTO exit_form" +
      '(student_id, "A1_1", "A2_1", "A2_2", "A2_3", "A2_4", "A2_5", "A2_6", "A2_7", "A2_8", "A3_1", "A3_2", "A3_3", "A4_1", "A5_1", "A6_1", "A6_2", "A6_3", "B1_1", "B1_2", "B1_3", "B1_4", "B1_5", "B1_6", "B1_7", "B1_8", "C1_1" )' +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)",
      [studentId,
        form.A1_1, form.A2_1, form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A2_7, form.A2_8,
        form.A3_1, form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.A6_2, form.A6_3,
        form.B1_1, form.B1_2, form.B1_3, form.B1_4, form.B1_5, form.B1_6, form.B1_7, form.B1_8, form.C1_1
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
    throw Error('Error while updating student positions');
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
    throw Error('Error while inserting student positions' + body.afm);
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
    let positionInfo = null;

    if (atlas) {
      positionInfo = await pool.query("SELECT name as company, afm, title, city, last_update_string FROM atlas_position_group pos" +
        " INNER JOIN atlas_provider prov" +
        " ON pos.provider_id = prov.atlas_provider_id" +
        " WHERE pos.atlas_position_id = $1", [positionId]);
    } else {
      positionInfo = await pool.query("SELECT name as company, afm, title, city, last_update_string FROM internal_position_group pos" +
        " INNER JOIN atlas_provider prov" +
        " ON pos.provider_id = prov.id" +
        " WHERE pos.id = $1", [positionId]);
    }
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
  insertOrUpdateMetadataBySSOUid
};
