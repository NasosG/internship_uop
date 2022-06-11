const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController.js");

router.post("/insertCompanyUser/", companyController.insertCompanyUsers);
router.get("/getProviderByAfm/:afm", companyController.getProviderByAfm);

module.exports = router;
