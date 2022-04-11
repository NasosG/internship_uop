const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

// router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroups);
router.get('/getAtlasNewestPositionGroups/:begin', atlasController.getAtlasNewestPositionGroups);
router.get('/getAtlasOldestPositionGroups/:begin', atlasController.getAtlasOldestPositionGroups);
router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroupsUI);
router.post('/getAtlasFilteredPositions/:begin', atlasController.getAtlasFilteredPositions);
router.get('/insertPositionGroup/', atlasController.insertPositionGroup);

module.exports = router;
