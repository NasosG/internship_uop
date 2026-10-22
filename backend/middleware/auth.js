const { verifyToken } = require("../config/jwt.js");

/**
 *
 * function that verifies jwt token
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
module.exports = (request, response, next) => {
  // Local development only: the frontend does not get a token without the SSO login
  if (process.env.ENV === "DEV" && process.env.AUTH_DEV_BYPASS === "true") {
    return next();
  }

  try {
    const [scheme, token] = (request.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token || token === "undefined") {
      throw new Error("missing token");
    }

    const decodedToken = verifyToken(token);
    request.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role
    };
    next();
  } catch (error) {
    // Marks the 401 as an auth error (controllers also use 401 for other errors),
    // so the frontend logs the user out only for this one
    response.setHeader("X-Auth-Error", "true");
    response.setHeader("Access-Control-Expose-Headers", "X-Auth-Error");
    response.status(401).json({
      message: "Auth failed! " + error.message
    });
  }
};
