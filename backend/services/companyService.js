// database connection configuration
const {
  async
} = require("rxjs");
const pool = require("../db_config.js");

const insertCompanyUsers = async (body) => {
  try {
    await pool.query("INSERT INTO generic_users (username, password, atlas_account, user_type, company_id) " +
      " VALUES" +
      " ($1, $2, $3, $4, $5)",
      [body.username, body.password, 'false', 'company', null]);
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

const getProviderByAfm = async (afm) => {
  try {
    const providerByAfm = await pool.query("SELECT * FROM atlas_provider WHERE afm = $1 ", [afm]);
    return providerByAfm;
  } catch (error) {
    throw Error('Error while fetching afm');
  }
}


module.exports = {
  insertCompanyUsers,
  insertProviders,
  getProviderByAfm
};
