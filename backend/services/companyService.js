// database connection configuration
const pool = require("../db_config.js");
const atlasService = require("../services/atlasService");
const MiscUtils = require("../MiscUtils.js");
const nodemailer = require('nodemailer');
const gmailTransporter = require('../mailer_config.js');
const bcrypt = require('bcrypt');

const getProviderById = async (id) => {
  try {
    const companies = await pool.query("SELECT * FROM generic_users gu \
                                        INNER JOIN atlas_provider pr ON gu.company_id = pr.id \
                                        WHERE gu.g_user_id = $1", [id]);
    return companies.rows[0];
  } catch (error) {
    throw Error('Error while fetching company users');
  }
};

const getProviderIdByUserId = async (id) => {
  try {
    const companies = await pool.query("SELECT company_id FROM generic_users gu \
                                        WHERE gu.g_user_id = $1", [id]);
    return companies.rows[0];
  } catch (error) {
    throw Error('Error while fetching company users');
  }
};

const getStudentActiveApplications = async (companyName, companyAFM) => {
  try {
    const applications = await pool.query(`SELECT final_app_positions.*, active_applications_ranked.* FROM final_app_positions
                                          INNER JOIN active_applications_ranked ON active_applications_ranked.app_id = final_app_positions.application_id
                                          LEFT JOIN internship_assignment
                                          ON final_app_positions.position_id = internship_assignment.position_id AND
                                          active_applications_ranked.student_id = internship_assignment.student_id
                                          WHERE afm = $1 AND company = $2
                                          AND internship_assignment.student_id IS NULL`, [companyAFM, companyName]);

    // const applications = await pool.query(`SELECT *
    //   FROM final_app_positions
    //   INNER JOIN active_applications_ranked ON active_applications_ranked.app_id = final_app_positions.application_id
    //   LEFT JOIN internship_assignment ON  active_applications_ranked.student_id = internship_assignment.student_id
    //       WHERE
    //         (afm = $1 AND company = $2 AND
    //           (internship_assignment.student_id IS NULL OR
    //             (internship_assignment.student_id IS NOT NULL AND internship_assignment.position_id != final_app_positions.app_pos_id)
    //           )
    //       ) `, [companyAFM, companyName]);

    return applications.rows;
  } catch (error) {
    throw Error('Error while fetching student active applications' + error.message);
  }
};

const checkIfEmailExists = async (userMail) => {
  try {
    let emailFoundResult = await pool.query("SELECT * FROM atlas_provider WHERE contact_email = $1", [userMail]);
    return emailFoundResult.rowCount > 0;
  } catch (error) {
    throw Error('Error while searching for provider\'s email');
  }
};

const updateUserPassword = async (userPassword, userMail) => {
  try {
    // Hash the password before inserting it to the DB
    let hashPassword = await bcrypt.hash(userPassword, MiscUtils.SALT_ROUNDS);
    // Update the DB
    await pool.query("UPDATE generic_users SET password = $1 \
                      FROM atlas_provider ap \
                      WHERE ap.id = generic_users.company_id AND ap.contact_email = $2", [hashPassword, userMail]);
  } catch (error) {
    throw Error('Error while updating provider\'s password');
  }
};

const getStudentAssignedApplications = async (companyName, companyAFM) => {
  try {
    const STATUS = 0; //status = 0 means that the application is active
    const applications = await pool.query(`SELECT final_app_positions.*, active_applications_ranked.*, internship_assignment.approval_state
                        FROM final_app_positions
                        INNER JOIN active_applications_ranked ON active_applications_ranked.app_id = final_app_positions.application_id
                        INNER JOIN internship_assignment ON final_app_positions.position_id = internship_assignment.position_id
                        AND active_applications_ranked.student_id = internship_assignment.student_id
                        WHERE company = $1 AND afm = $2
                        AND internship_assignment.status = $3 `, [companyName, companyAFM, STATUS]);

    return applications.rows;
  } catch (error) {
    throw Error('Error while fetching student active applications');
  }
};

const getStudentAMandDepartmentById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT schacpersonaluniquecode as student_registry, department_id FROM sso_users \
                                              WHERE sso_users.uuid = $1", [id]);
    // const student = MiscUtils.splitStudentsAM(resultsSSOUsers.rows[0].student_registry);
    console.log(id);
    const firstRow = resultsSSOUsers.rows[0];
    const student = {
      registry_number: MiscUtils.splitStudentsAM(firstRow.student_registry),
      department_id: firstRow.department_id
    };
    return student;
  } catch (error) {
    throw Error('Error while fetching students' + error.message);
  }
};

const getInternalPositionsByProviderId = async (providerId) => {
  try {
    const internalPositionGroups = await pool.query("SELECT *, to_char(\"last_update_string\", 'DD/MM/YYYY') as publication_date " +
      " FROM internal_position_group g" +
      " INNER JOIN generic_users usr ON g.provider_id = usr.company_id" +
      " WHERE usr.g_user_id = $1", [providerId]);
    return internalPositionGroups.rows;
  } catch (error) {
    throw Error('Error while fetching internal position groups for provider ' + providerId);
  }
};

const getInternalPositionByPositionId = async (positionId) => {
  try {
    const internalPositionGroups = await pool.query("SELECT *, to_char(\"last_update_string\", 'DD/MM/YYYY') as publication_date " +
      " FROM internal_position_group g" +
      " INNER JOIN generic_users usr ON g.provider_id = usr.company_id" +
      " WHERE g.id = $1", [positionId]);
    return internalPositionGroups.rows[0];
  } catch (error) {
    throw Error('Error while fetching internal position groups for provider ' + positionId);
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

const insertAssignment = async (body) => {
  try {
    const myObj = Object.assign(body);
    const STATE = 0;

    for (let item of myObj) {
      let positionData;

      // Get position details depending if it's atlas or internal position
      if (item.position_id != null)
        positionData = await atlasService.getPositionGroupFromDBById(item.position_id);
      else if (item.internal_position_id != null)
        positionData = await getInternalPositionByPositionId(item.internal_position_id);

      await pool.query("INSERT INTO internship_assignment(assignment_id, position_id, internal_position_id, student_id, time_span, physical_objects, city, status, pa_subject_atlas, period_id) " +
        " VALUES" +
        " (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [item.position_id, item.internal_position_id, item.student_id, positionData.duration, positionData.physical_objects, item.city, STATE, positionData.title, item.period_id]);
    }

  } catch (error) {
    console.error("insertAssignment error: " + error.message);
    throw Error('Error while inserting assignment');
  }
};

const insertCompanyUsers = async (body, newlyCreatedProviderId) => {
  try {
    if (newlyCreatedProviderId != null) body.id = newlyCreatedProviderId;
    const users = await checkIfUsernameAlreadyExists(body.username);

    if (users.rowCount > 0) {
      console.log("Username already exists");
      return false;
    }

    let hashPassword = await bcrypt.hash(body.password, MiscUtils.SALT_ROUNDS);
    // console.log(hashPassword);
    await pool.query("INSERT INTO generic_users (username, password, atlas_account, user_type, company_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5)",
      [body.username, hashPassword, 'true', 'company', body.id]);

    return true;
  } catch (error) {
    throw Error('Error while inserting company users');
  }
};

const insertProviders = async (body) => {
  try {
    const queryText = 'INSERT INTO atlas_provider (name, contact_email, contact_phone, afm, contact_name) VALUES ($1, $2, $3, $4, $5) RETURNING id ';
    const result = await pool.query(queryText, [body.name, body.contact_email, body.contact_phone, body.afm, body.contact_name]);

    return result.rows[0].id;
  } catch (error) {
    throw Error('Error while inserting providers' + error.message);
  }
};

const checkIfUsernameAlreadyExists = async (username) => {
  try {
    let usernameFoundResult = await pool.query("SELECT * FROM generic_users WHERE username = $1", [username]);
    return usernameFoundResult;
  } catch (error) {
    throw Error('Error while checking if username already exists');
  }
};

const getProviderByAfm = async (afm) => {
  try {
    const providerByAfm = await pool.query("SELECT * FROM atlas_provider WHERE afm = $1 ", [afm]);
    return providerByAfm.rows;
  } catch (error) {
    throw Error('Error while fetching afm');
  }
};

const getProviderByAfmAndName = async (afm, companyName) => {
  try {
    const providerByAfm = await pool.query("SELECT * FROM atlas_provider WHERE afm = $1 and name = $2", [afm, companyName]);
    return providerByAfm.rows;
  } catch (error) {
    console.error(error);
    throw Error('Error while fetching providers by afm and name');
  }
};

const userAlreadyExists = async (username, password) => {
  try {
    let usernameFoundResult = await pool.query("SELECT * FROM generic_users WHERE username = $1", [username]);
    return usernameFoundResult;
  } catch (error) {
    throw Error('Error while checking if username already exists');
  }
};

const loginCompany = async (username, password) => {
  try {
    const userAlreadyExist = await userAlreadyExists(username, password);
    if (userAlreadyExist.rowCount == 0) {
      console.log('invalid credentials');
      return;
    }

    const passwordMatches = await bcrypt.compare(password, userAlreadyExist.rows[0].password);

    if (passwordMatches)
      return userAlreadyExist.rows[0].g_user_id;
    else
      return null;

  } catch (error) {
    throw Error('Error while logging in');
  }
};


const insertInternalPositionGroup = async (data, providerId) => {
  try {
    // console.log(data);
    await pool.query("INSERT INTO internal_position_group" +
      '(description, city, title, position_type, available_positions, duration, physical_objects, provider_id, last_update_string, atlas_position_id, city_id, country_id, prefecture_id, start_date, start_date_string, end_date, end_date_string)' +
      " VALUES " + "($1, $2, $3, $4, $5, $6, $7, $8, current_timestamp, $9, $10, $11, $12, $13, $14, $15, $16)",
      [data.description,
      data.city,
      data.title,
      data.position_type,
      data.available_positions,
      data.duration,
      data.physical_objects,
        providerId,
        null,
        null,
      data.country,
      data.prefecture,
        null,
        null,
        null,
        null
      ]);

    // Insert academics into academics table
    // for (let academic of item.academics) {
    //   await pool.query("INSERT INTO position_has_academics(position_id, academic_id)" +
    //     " VALUES ($1, $2)", [item.atlasPositionId, academic.academicsId]);
    // }

    // }
    // return insertResults;
  } catch (error) {
    console.log('Error while inserting position group[s]' + error.message);
    throw Error('Error while inserting position group[s]');
  }
};

// generate a pseudorandom password
const generatePassword = (passwordLength) => {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
};

module.exports = {
  getInternalPositionsByProviderId,
  getProviderIdByUserId,
  getInternalPositionByPositionId,
  getProviderByAfm,
  getProviderByAfmAndName,
  getProviderById,
  getStudentActiveApplications,
  getStudentAssignedApplications,
  getPreassignModeByDepartmentId,
  getStudentAMandDepartmentById,
  insertCompanyUsers,
  insertProviders,
  insertInternalPositionGroup,
  insertAssignment,
  loginCompany,
  checkIfEmailExists,
  updateUserPassword,
  generatePassword
};
