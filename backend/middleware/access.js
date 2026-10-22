const checkAuth = require("./auth.js");
const requireRole = require("./role.js");

/**
 * Ready-made combinations of the auth middleware (valid token) and role checks
 */
module.exports = {
  // Every university user (SSO login) and the admin, not the companies (password login, open sign-up)
  checkUniversityUser: [checkAuth, requireRole("student", "depmanager", "office", "admin")]
};
