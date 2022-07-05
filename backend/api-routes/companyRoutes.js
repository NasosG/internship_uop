const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController.js");

router.get("/getProviderByAfm/:afm", companyController.getProviderByAfm);
router.get("/getProviderById/:id", companyController.getProviderById);
router.get("/getStudentActiveApplications/", companyController.getStudentActiveApplications);
router.get("/getInternalPositionsByProviderId/:id", companyController.getInternalPositionsByProviderId);;
router.post("/insertCompanyUser/", companyController.insertCompanyUsers);
router.post("/insertInternalPosition/:id", companyController.insertInternalPositionGroup);
router.post("/login/", companyController.login);

module.exports = router;
