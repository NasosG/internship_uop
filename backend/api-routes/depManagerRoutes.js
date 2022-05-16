const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const depManagerController = require("../controllers/depManagerController.js");

router.get("/getDepManagerById/:id", depManagerController.getDepManagerById);
router.get("/getPeriodByUserId/:id", depManagerController.getPeriodByUserId);
router.post("/insertPeriod/:id", depManagerController.insertPeriod);


module.exports = router;
