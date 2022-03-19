const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
//const checkAuth = require("../middleware/auth.js");

router.post('/login', atlasController.atlasLogin);
router.get('/getAcademics', atlasController.getDepartmentIds);

module.exports = router;
