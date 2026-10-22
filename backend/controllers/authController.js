const { signToken, JWT_EXPIRES_IN_SECONDS } = require("../config/jwt.js");

/**
 * Returns a new token (with a new expiration) for a user that still has a valid token.
 * Called by the frontend while the user is active, so that active users are not logged out
 */
const refreshToken = async (request, response) => {
  if (!request.userData) {
    return response.status(401).json({
      message: "Auth failed!"
    });
  }

  const token = signToken(request.userData.userId, request.userData.role);
  response.status(200).json({
    token: token,
    expiresIn: JWT_EXPIRES_IN_SECONDS,
    userId: request.userData.userId
  });
};

module.exports = {
  refreshToken
};
