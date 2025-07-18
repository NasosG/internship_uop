// database connection configuration
const pool = require("../config/db_config.js");
// Logging
const logger = require('../config/logger');

const loginAdmin = async (username) => {
  try {
    const resultsUserRoles = await pool.query("SELECT * FROM users_roles \
                                               WHERE sso_username = $1", [username]);
    if (resultsUserRoles.rowCount >= 1) {
      return resultsUserRoles.rows[0].user_role_id;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in');
  }
};

const mapRoleToDB = (role) => {
  const roleList = ['Τμηματικός Υπεύθυνος', 'Γραφείο Πρακτικής Άσκησης'];
  const roleListForDB = ['department-manager', 'office'];

  // turn Τμηματικός Υπεύθυνος, Γραφείο Πρακτικής Άσκησης to [department-manager, office]
  return roleListForDB[roleList.indexOf(role)];
};

const insertRoles = async (username, role, isAdmin, academics) => {
  try {
    role = mapRoleToDB(role);
    const userRole = await pool.query("INSERT INTO users_roles(sso_username, user_role, is_admin)" +
      " VALUES ($1, $2, $3) RETURNING user_role_id", [username, role, isAdmin]);
    const userRoleId = userRole.rows[0].user_role_id;

    for (let academic of academics) {
      await pool.query("INSERT INTO role_manages_academics(user_role_id, academic_id)" +
        " VALUES ($1, $2)", [userRoleId, academic]);
    }
  } catch (error) {
    throw Error('Error while inserting position group relations' + error);
  }
};

const getUsersWithRoles = async () => {
  try {
    const users = await pool.query("SELECT * FROM sso_users \
    RIGHT JOIN users_roles ON users_roles.sso_username = sso_users.id");
    return users.rows;
  } catch (error) {
    throw Error('Error while getting users with roles' + error);
  }
};

const getDepartmentsOfUserByUserID = async (userRoleId) => {
  try {
    const users = await pool.query("SELECT academic_id FROM users_roles \
                                    INNER JOIN role_manages_academics ON \
                                    role_manages_academics.user_role_id = users_roles.user_role_id \
                                    WHERE users_roles.user_role_id = $1", [userRoleId]);
    return users.rows;
  } catch (error) {
    throw Error('Error while getting departments of user by username' + error);
  }
};

const deleteUserRoleByUserId = async (userRoleId) => {
  try {
    await pool.query("DELETE FROM users_roles WHERE user_role_id = $1", [userRoleId]);
  } catch (error) {
    throw Error("Error while deleting user role with user_role_id: " + userRoleId + " - " + error.message);
  }
};

const getStudentsWithoutSheets = async (departmentId, type, useDate = false, selectedDate = null) => {
  try {
    let query;
    let params;

    if (type !== 'entry' && type !== 'exit') {
      throw new Error('Invalid type');
    }

    if (useDate && selectedDate) {
      if (type === 'entry') {
        query = `SELECT * FROM get_approved_students_with_no_entry_sheet_for_date($1, $2)`;
      } else {
        query = `SELECT * FROM get_approved_students_with_no_exit_sheet_for_date($1, $2)`;
      }
      params = [departmentId, selectedDate];
    } else {
      if (type === 'entry') {
        query = `SELECT * FROM get_approved_students_with_no_entry_sheet($1)`;
      } else {
        query = `SELECT * FROM get_approved_students_with_no_exit_sheet($1)`;
      }
      params = [departmentId];
    }

    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('fetchStudentsWithoutSheets error:', error);
    throw error;
  }
};

module.exports = {
  loginAdmin,
  getUsersWithRoles,
  getDepartmentsOfUserByUserID,
  getStudentsWithoutSheets,
  deleteUserRoleByUserId,
  insertRoles
};
