const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

router.get('/getAvailablePositionGroups', atlasController.getAvailablePositionGroups);

module.exports = router;
