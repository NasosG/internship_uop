const jwt = require("jsonwebtoken");
require('dotenv').config();

// Tokens expire after 4 hours, after which users have to log in again
const JWT_EXPIRES_IN_SECONDS = 4 * 60 * 60;
const JWT_ALGORITHM = "HS256";

const JWT_SECRET = process.env.JWT_SECRET;

// Fail fast on startup instead of signing tokens with a weak / missing key
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET is missing from .env or is shorter than 32 characters");
}

/**
 * Signs a jwt token for the given user id and role
 *
 * @param {*} userId
 * @param {*} role student, depmanager, office, admin or company
 * @returns the signed token
 */
const signToken = (userId, role) => {
  return jwt.sign({ userId: userId, role: role }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_EXPIRES_IN_SECONDS
  });
};

/**
 * Verifies a jwt token, throws if it is invalid or expired
 *
 * @param {*} token
 * @returns the decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
};

module.exports = {
  JWT_EXPIRES_IN_SECONDS,
  signToken,
  verifyToken
};
