const checkAuth = require("./auth.js");
const requireRole = require("./role.js");
const requireOwnStudentId = require("./ownStudentId.js");

// Every university user (SSO login) and the admin, not the companies (password login, open sign-up)
const checkUniversityUser = [checkAuth, requireRole("student", "depmanager", "office", "admin")];

/**
 * Ready-made combinations of the auth middleware (valid token) and role checks
 */
module.exports = {
  checkUniversityUser,
  // University users, but a student only with his own id in the route (:id)
  checkOwnStudentData: [...checkUniversityUser, requireOwnStudentId],
  // Department managers, office and admin only (actions on students, not done by the students)
  checkStaff: [checkAuth, requireRole("depmanager", "office", "admin")],
  // Internship office and admin only (e.g. sending the students' sheets to the OPS)
  checkOffice: [checkAuth, requireRole("office", "admin")],
  // Admin only (admin panel)
  checkAdmin: [checkAuth, requireRole("admin")]
};
