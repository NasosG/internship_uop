// database connection configuration
const pool = require("../db_config.js");

const getStudents = async () => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users where id='pcst19003'");
    const resultsStudents = await pool.query("SELECT * FROM student_users where id = '1'")
    // const results3 = [resultsSSOUsers.rows, resultsStudents.rows];
    const finalStudentsResults = resultsSSOUsers.rows.concat(resultsStudents.rows);

    return finalStudentsResults;
  } catch (error) {
    throw Error('Error while fetching students');
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
    const resultsStudentPositions = await pool.query("SELECT id, student_id, priority, company, title, place, to_char(\"upload_date\", 'DD/MM/YYYY') as upload_date \
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

const updateStudentDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4  WHERE id = $5",
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
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE id = $4",
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
      "education = $1, experience = $2, languages = $3, computer_skills = $4, other_edu = $5, honors = $6, interests = $7, skills = $8 WHERE id = $9",
      [student.education, student.experience, student.languages, student.computer_skills, student.other_edu, student.honors, student.interests, student.skills, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentContact = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE id = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
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
    // console.log(body);
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
    const updateResults = await pool.query("UPDATE student_applications SET application_status='false' WHERE id = $1", [applicationId]);
    return updateResults;
  } catch (error) {
    throw Error(`Error while updating application status to inactive ${applicationId} student_applications`);
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
    throw Error('Error while updating students entry form');
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

//Not currently used, real time deletion on student application table
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
    await pool.query("INSERT INTO student_positions (student_id, priority, company, title, place, upload_date) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5, $6)",
      [studentId, body.priority, body.company, body.title, body.place, body.upload_date]);
  } catch (error) {
    throw Error('Error while inserting student positions');
  }
};

module.exports = {
  getStudents,
  getStudentEntrySheets,
  getStudentExitSheets,
  getStudentEvaluationSheets,
  getStudentApplications,
  getStudentPositions,
  insertStudentEntrySheet,
  insertStudentPositions,
  insertStudentExitSheet,
  insertStudentEvaluationSheet,
  insertStudentApplication,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentEntrySheet,
  updateStudentPositionPriorities,
  updateStudentPositions,
  updateStudentExitSheet,
  deleteEntryFormByStudentId,
  deleteApplicationById,
  deletePositionsByStudentId
};
