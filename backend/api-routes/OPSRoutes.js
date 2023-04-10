const express = require('express');
const router = express.Router();
const OPSController = require("../controllers/OPSController.js");
//const checkAuth = require("../middleware/auth.js");

router.post('/sendDeltioEisodouWS/:id', OPSController.sendDeltioEisodouWS);
router.post('/sendDeltioExodouWS/:id', OPSController.sendDeltioExodouWS);
router.post('/sendDeltioEisodouXML/:id', OPSController.sendDeltioEisodouXML);
router.post('/sendDeltioExodouXML/:id', OPSController.sendDeltioExodouXML);

module.exports = router;
