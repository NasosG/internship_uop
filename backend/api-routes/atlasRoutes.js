const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroups);

module.exports = router;
