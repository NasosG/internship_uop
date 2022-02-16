// database connection configuration
const pool = require("../db_config.js");

const getStudents = async () => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users where id='pcst19003'");
    const resultsStudents = await pool.query("SELECT * FROM student_users where id = '1'")
    // const results3 = [resultsSSOUsers.rows, resultsStudents.rows];
    const finalStudentsResults = resultsSSOUsers.rows.concat(resultsStudents.rows);

    return finalStudentsResults;
  } catch (exception) {
    throw Error('Error while fetching students');
  }
};

const updateStudentDetails = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4  WHERE id = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

    return inserts;
  } catch (exception) {
    throw Error('Error while updating students')
  }
};

const updateStudentContractDetails = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE id = $4",
      [student.ssn, student.doy, student.iban, id]
    );

    return inserts;
  } catch (exception) {
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
  } catch (exception) {
    throw Error('Error while updating students');
  }
};

const updateStudentContact = async (student, id) => {
  try {
    const inserts = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE id = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]
    );

    return inserts;
  } catch (exception) {
    throw Error('Error while updating students');
  }
};

module.exports = {
  getStudents,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact
};
