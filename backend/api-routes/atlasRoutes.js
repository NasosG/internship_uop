const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroups);
// router.get('/getAtlasNewestPositionGroups/:begin', atlasController.getAtlasNewestPositionGroups);
module.exports = router;
