const express = require('express');
const router = express.Router();
const OPSController = require("../controllers/OPSController.js");
//const checkAuth = require("../middleware/auth.js");

router.post('/sendDeltioEisodouWS/:id', OPSController.sendDeltioEisodouWS);
router.post('/sendDeltioExodouWS/:id', OPSController.sendDeltioExodouWS);

module.exports = router;
