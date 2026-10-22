const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const authController = require("../controllers/authController.js");

router.post("/refresh", checkAuth, authController.refreshToken);

module.exports = router;
