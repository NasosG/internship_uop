// database connection configuration
const pool = require("../db_config.js");
const atlasService = require("../services/atlasService");

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
      const applications = await pool.query("SELECT * FROM active_applications_ranked \
                                            WHERE (positions[$1]->>'company')::varchar = $2 \
                                            AND (positions[$1]->>'afm')::varchar = $3", [i, companyName, companyAFM]);
      // push first element which contains actual json[]
      if (applications.rows[0])
        apps.push(applications.rows[0]);
    }

    return apps;
  } catch (error) {
    throw Error('Error while fetching student active applications');
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
      // push first element which contains actual json[]
      if (applications.rows[0])
        apps.push(applications.rows[0]);
    }

    return apps;
  } catch (error) {
    throw Error('Error while fetching student active applications');
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

    await pool.query("INSERT INTO generic_users (username, password, atlas_account, user_type, company_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5)",
      [body.username, body.password, 'false', 'company', body.id]);

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
    let usernameFoundResult = await pool.query("SELECT * FROM generic_users WHERE username = $1 AND password = $2", [username, password]);
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

    return userAlreadyExist.rows[0].g_user_id;
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

module.exports = {
  getInternalPositionsByProviderId,
  getProviderIdByUserId,
  getInternalPositionByPositionId,
  getProviderByAfm,
  getProviderById,
  getStudentActiveApplications,
  getStudentAssignedApplications,
  insertCompanyUsers,
  insertProviders,
  insertInternalPositionGroup,
  insertAssignment,
  loginCompany
};
