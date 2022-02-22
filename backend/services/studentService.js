// database connection configuration
// const {
//   map
// } = require("jquery");
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
    const resultsEntrySheets = await pool.query("SELECT * FROM entry_form where id = $1", [id]);
    return resultsEntrySheets;
  } catch (error) {
    throw Error('Error while fetching student entry sheet');
  }
};

const updateStudentDetails = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4  WHERE id = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

    return inserts;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentContractDetails = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE id = $4",
      [student.ssn, student.doy, student.iban, id]
    );

    return inserts;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentBio = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users " +
      "SET " +
      "education = $1, experience = $2, languages = $3, computer_skills = $4, other_edu = $5, honors = $6, interests = $7, skills = $8 WHERE id = $9",
      [student.education, student.experience, student.languages, student.computer_skills, student.other_edu, student.honors, student.interests, student.skills, id]
    );

    return inserts;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentContact = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE id = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]);

    return inserts;
  } catch (error) {
    throw Error('Error while updating students');
  }
};

const updateStudentEntrySheet = async (form, id) => {
  try {
    some_id = 1 // dummy id -> to be changed

    const inserts = await pool.query("UPDATE student_users \
     SET " + "A1_1 = $1, A1_2 = $2, A1_3 = $3, A2_1 = $4, A2_2 = $5, A2_3 = $6, A2_4 = $7, A2_5 = $8, A2_6 = $9, A3_1 = $10, A3_2 = $11, " +
      "A3_3 = $12, A4_1 = $13, A5_1 = $14, A6_1 = $15, B1_1 = $16" +
      " WHERE entry_id = $17 ",
      [form.A1_1, form.A1_2, form.A1_3, form.A2_1,
        form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A3_1,
        form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.B1_1, some_id
      ]);
    return inserts;
  } catch (error) {
    console.log(error.message);
    throw Error('Error while updating students entry form');
  }
};

const insertStudentEntrySheet = async (form, id) => {
  try {
    const inserts = await pool.query("INSERT INTO entry_form" +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
      [form.A1_1, form.A1_2, form.A1_3, form.A2_1,
        form.A2_2, form.A2_3, form.A2_4, form.A2_5, form.A2_6, form.A3_1,
        form.A3_2, form.A3_3, form.A4_1, form.A5_1, form.A6_1, form.B1_1
      ]);
    return inserts;
  } catch (error) {
    throw Error('Error while inserting students entry form');
  }
};

module.exports = {
  getStudents,
  getStudentEntrySheets,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentEntrySheet,
  insertStudentEntrySheet
};
