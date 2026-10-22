/**
 *
 * function that allows the request only for users with one of the given roles,
 * must be used after the auth middleware (checkAuth)
 *
 * @param  {...any} allowedRoles e.g. "admin"
 */
module.exports = (...allowedRoles) => (request, response, next) => {
  // Local development only: same bypass as the auth middleware
  if (process.env.ENV === "DEV" && process.env.AUTH_DEV_BYPASS === "true") {
    return next();
  }

  if (!request.userData || !allowedRoles.includes(request.userData.role)) {
    return response.status(403).json({
      message: "Forbidden"
    });
  }

  next();
};
