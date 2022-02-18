const jwt = require("jsonwebtoken");

/**
 *
 * function that verifies jwt token
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
module.exports = (request, response, next) => {
  try {
    const secretString = "secret_this_should_be_longer";
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretString);
    request.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    response.status(401).json({
      message: "Auth failed!"
    });
  }
};
