// database connection configuration
const pool = require("../db_config.js");

// TODO: check if it works and test it
const insertRoles = async (username, role, isAdmin, academics) => {
  try {
    const userRole = await pool.query("INSERT INTO users_roles(sso_username, user_role, is_admin)" +
      " VALUES ($1, $2, $3) RETURNING user_role_id", [username, role, isAdmin]);

    for (const academic of academics) {
      await pool.query("INSERT INTO role_manages_academics(user_role_id, academic_id)" +
        " VALUES ($1, $2)", [userRole.user_role_id, academics.academicId]);
    }
  } catch (error) {
    throw Error('Error while inserting position group relations');
  }
};

module.exports = {
  insertRoles
};
