const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

router.get('/getAcademics', atlasController.getDepartmentIds);
router.get('/getPhysicalObjects', atlasController.getPhysicalObjects);
router.get('/getPositionGroupDetails', atlasController.getPositionGroupDetails);
router.post('/getAvailablePositionGroups', atlasController.getAvailablePositionGroups);
router.get('/getProviderDetails', atlasController.getProviderDetails);

module.exports = router;
