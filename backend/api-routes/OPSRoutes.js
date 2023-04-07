const express = require('express');
const router = express.Router();
const OPSController = require("../controllers/OPSController.js");
//const checkAuth = require("../middleware/auth.js");

router.post('/sendDeltioEisodouWS/:begin', OPSController.sendDeltioEisodouWS);
router.post('/sendDeltioExodouWS/:begin', OPSController.sendDeltioExodouWS);

module.exports = router;
