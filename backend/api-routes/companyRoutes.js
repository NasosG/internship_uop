const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController.js");

router.get("/getProviderByAfm/:afm", companyController.getProviderByAfm);
router.get("/getProviderById/:id", companyController.getProviderById);
router.post("/insertCompanyUser/", companyController.insertCompanyUsers);
router.post("/login/", companyController.login);

module.exports = router;
