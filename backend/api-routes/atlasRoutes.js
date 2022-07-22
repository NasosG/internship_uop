const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

// router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroups);
// router.post('/getRegisteredStudents/', atlasController.getRegisteredStudents);
router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroupsUI);
router.post('/getAtlasFilteredPositions/:begin', atlasController.getAtlasFilteredPositions);
router.get('/insertPositionGroup/', atlasController.insertPositionGroup);
router.get('/getInstitutions', atlasController.getInstitutions);
router.get('/insertTablesFromAtlas', atlasController.insertTablesFromAtlas);
router.get('/getCities', atlasController.getCities);
router.get('/getPrefectures', atlasController.getPrefectures);
router.get('/getCountries', atlasController.getCountries);
router.get('/getPhysicalObjects', atlasController.getPhysicalObjects);
router.get('/getGenericPositionSearch/', atlasController.getGenericPositionSearch);
router.get('/getRegisteredStudent/', atlasController.getRegisteredStudent);

module.exports = router;
