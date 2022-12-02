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
    // Constants
    const MAX_POSITIONS_NUMBER = 5;
    const OFFSET = 1;
    // Variables
    let apps = [];

    // loop through positions in applications of the database
    for (let i = OFFSET; i < MAX_POSITIONS_NUMBER + OFFSET; i++) {
      const assignedApps = await getStudentAssignedApplications(companyName, companyAFM);
      const applications = await pool.query("SELECT * FROM active_applications_ranked \
                                            WHERE (positions[$1]->>'company')::varchar = $2 \
                                            AND (positions[$1]->>'afm')::varchar = $3", [i, companyName, companyAFM]);

      // if student has an assigned application to some position, in assignedApps json array,
      // then don't show it in the active applications
      let found = false;
      for (const app of assignedApps) {
        for (const position of app.positions) {
          if (position?.position_id == applications?.rows[0]?.positions[0].position_id
            && app?.student_id == applications?.rows[0]?.student_id) {
            found = true;
            console.log("found application in assigned apps");
          }
        }
      }

      // push first element which contains actual json[]
      if (applications.rows[0] && !found)
        apps.push(applications.rows[0]);
    }

    return apps;
  } catch (error) {
    throw Error('Error while fetching student active applications');
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
    // Constants
    const MAX_POSITIONS_NUMBER = 5;
    const OFFSET = 1;
    // Variables
    let apps = [];

    // loop through positions in applications of the database
    for (let i = OFFSET; i < MAX_POSITIONS_NUMBER + OFFSET; i++) {
      const applications = await pool.query("SELECT * FROM active_applications_ranked d \
                                            INNER JOIN internship_assignment a \
                                            ON (d.positions[$1] ->> 'internal_position_id':: varchar = a.internal_position_id:: varchar \
	                                            OR d.positions[$1] ->> 'position_id':: varchar = a.position_id:: varchar) \
                                              AND(positions[$1] ->> 'company'):: varchar = $2 \
                                              AND(positions[$1] ->> 'afm'):: varchar = $3 \
                                              AND a.status = 0", [i, companyName, companyAFM]);
      //                                                    /\ status = 0 means that the application is active
      // push first element which contains actual json[]
      if (applications.rows[0])
        apps.push(applications.rows[0]);
    }

    return apps;
  } catch (error) {
    throw Error('Error while fetching student active applications');
  }
};


const getStudentAMById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT schacpersonaluniquecode as student_registry FROM sso_users \
                                              WHERE sso_users.uuid = $1", [id]);
    const student = MiscUtils.splitStudentsAM(resultsSSOUsers.rows[0].student_registry);
    return student;
  } catch (error) {
    throw Error('Error while fetching students');
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

      await pool.query("INSERT INTO internship_assignment(position_id, internal_position_id, student_id, time_span, physical_objects, city, status) " +
        " VALUES" +
        " ($1, $2, $3, $4, $5, $6, $7)",
        [item.position_id, item.internal_position_id, item.student_id, positionData.duration, positionData.physical_objects, item.city, STATE]);
    }

  } catch (error) {
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

const mainMailer = async (password) => {
  // send mail with defined transport object
  let info = await gmailTransporter.sendMail({
    from: "praktiki@uop.com", // sender address
    to: "thanos2259@gmail.com, thanasara@windowslive.com", // list of receivers
    subject: "Password Reset", // Subject line
    // send the email to the user to let him know that password has been changed
    html: "<span>Hello, You're receiving this email because you requested a password reset for your account.</span><br><br>" +
      "<span>Your new password is: <strong>" + password + "</strong></span><br><br>" +
      "<span>Click on the button below to login with your new password</span><br><br>" +
      "<a href='http://localhost:4200/credentials-generic' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Login</a>"
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = {
  getInternalPositionsByProviderId,
  getProviderIdByUserId,
  getInternalPositionByPositionId,
  getProviderByAfm,
  getProviderById,
  getStudentActiveApplications,
  getStudentAssignedApplications,
  getPreassignModeByDepartmentId,
  getStudentAMById,
  insertCompanyUsers,
  insertProviders,
  insertInternalPositionGroup,
  insertAssignment,
  loginCompany,
  checkIfEmailExists,
  updateUserPassword,
  generatePassword,
  mainMailer
};
