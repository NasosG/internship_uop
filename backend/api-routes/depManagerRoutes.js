const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/auth.js");
const depManagerController = require("../controllers/depManagerController.js");

router.get("/getDepManagerById/:id", depManagerController.getDepManagerById);
router.get("/getPeriodByUserId/:id", depManagerController.getPeriodByUserId);
router.get("/getStudentsApplyPhase/:id", depManagerController.getStudentsApplyPhase);
router.post("/insertPeriod/:id", depManagerController.insertPeriod);
router.put("/updatePeriodById/:id", depManagerController.updatePeriodById);
router.delete("/deletePeriodById/:id", depManagerController.deletePeriodById);

module.exports = router;
