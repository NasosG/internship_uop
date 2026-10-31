const express = require('express');
const router = express.Router();
const OPSController = require("../controllers/OPSController.js");
const { checkOffice, checkAdmin } = require("../middleware/access.js");

router.post('/sendDeltioEisodouWS/:id', checkOffice, OPSController.sendDeltioEisodouWS);
router.post('/sendDeltioExodouWS/:id', checkOffice, OPSController.sendDeltioExodouWS);
router.post('/sendDeltioEisodouXML/:id', checkOffice, OPSController.sendDeltioEisodouXML);
router.post('/sendDeltioExodouXML/:id', checkOffice, OPSController.sendDeltioExodouXML);
// Admin panel: result of an already submitted sheet (only the second call), by its submission id
router.post('/getDeltioResultWS', checkAdmin, OPSController.getDeltioResultWS);

module.exports = router;
