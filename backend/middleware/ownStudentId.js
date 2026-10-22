const logger = require("../config/logger");

/**
 *
 * function that allows a student to access only his own data: the :id of the route
 * must be the student's id from the token. Other roles (department manager, office, admin)
 * are not restricted here. Must be used after the auth middleware (checkAuth)
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
module.exports = (request, response, next) => {
  // Local development only: same bypass as the auth middleware
  if (process.env.ENV === "DEV" && process.env.AUTH_DEV_BYPASS === "true") {
    return next();
  }

  const user = request.userData;
  if (!user || user.role !== "student" || String(request.params.id) === String(user.userId)) {
    return next();
  }

  logger.warn("Forbidden " + request.method + " " + request.originalUrl + ": student " + user.userId + " requested another student's id");
  return response.status(403).json({
    message: "Forbidden"
  });
};
