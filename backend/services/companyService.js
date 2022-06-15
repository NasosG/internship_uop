// database connection configuration
const {
  async
} = require("rxjs");
const pool = require("../db_config.js");

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

const insertCompanyUsers = async (body) => {
  try {
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
    await pool.query("INSERT INTO atlas_provider (name, contact_email, contact_phone, afm, contact_name) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5)",
      [body.name, body.contact_email, body.contact_phone, body.afm, body.contact_name]);
  } catch (error) {
    throw Error('Error while inserting providers');
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

module.exports = {
  insertCompanyUsers,
  insertProviders,
  getProviderByAfm,
  getProviderById,
  loginCompany
};
