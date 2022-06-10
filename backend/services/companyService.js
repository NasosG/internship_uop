// database connection configuration
const pool = require("../db_config.js");


//ToDO
// const insertCompanyUsers = async (body) => {
//   try {
//     await pool.query("INSERT INTO generic_users (username, password, atlas_account, user_type) " +
//       " VALUES" +
//       " ($1, $2, $3, $4)",
//       [body.username, body.password, body.title, 'false', 'company']);
//   } catch (error) {
//     throw Error('Error while inserting company users');
//   }
// };

// const insertProviders = async (body) => {
//   try {
//     await pool.query("INSERT INTO atlas_provider (name, contact_email, contact_phone, afm, contact_name) " +
//       " VALUES" +
//       " ($1, $2, $3, $4, $5)",
//       [body.name, body.contact_email, body.contact_phone, body.afm, body.contact_name]);
//   } catch (error) {
//     throw Error('Error while inserting providers');
//   }
// };
