const crypto = require("crypto");
const logger = require("../config/logger");
require('dotenv').config();

/**
 *
 * function that verifies that an SSO login request comes from the PHP CAS app,
 * which sends the shared secret in the "x-login-secret" header.
 * Enforced only when LOGIN_SHARED_SECRET is set in .env
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
module.exports = (request, response, next) => {
  const expectedSecret = process.env.LOGIN_SHARED_SECRET;
  if (!expectedSecret) {
    return next();
  }

  const receivedSecret = request.headers["x-login-secret"] || "";
  const expected = Buffer.from(expectedSecret);
  const received = Buffer.from(receivedSecret);

  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    // Never log the secret itself, only whether it was sent and its length
    const reason = receivedSecret ? "wrong secret (length " + receivedSecret.length + ")" : "missing x-login-secret header";
    logger.warn("Rejected login " + request.originalUrl + " from " + request.ip + ": " + reason);
    return response.status(401).json({
      message: 'Unauthorized'
    });
  }

  next();
};
