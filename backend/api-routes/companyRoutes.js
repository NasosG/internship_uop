const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController.js");

router.get("/getProviderByAfm/:afm", companyController.getProviderByAfm);
router.get("/getProviderByAfmAndName/", companyController.getProviderByAfmAndName);
router.get("/getProviderById/:id", companyController.getProviderById);
router.get("/getStudentActiveApplications/", companyController.getStudentActiveApplications);
router.get("/getStudentAssignedApplications/", companyController.getStudentAssignedApplications);
router.get("/getInternalPositionsByProviderId/:id", companyController.getInternalPositionsByProviderId);
router.get("/getCompanysEvaluationForm/", companyController.getCompanysEvaluationForm);
router.post("/insertCompanyUser/", companyController.insertCompanyUsers);
router.post("/insertNewAssignment/:id", companyController.insertAssignment);
router.post("/insertInternalPosition/:id", companyController.insertInternalPositionGroup);
router.post("/login/", companyController.login);
router.post("/resetPassword/", companyController.resetPassword);
router.get("/getProviderByPositionId/:id", companyController.getProviderByPositionId);
router.post("/insertOrUpdateEvaluationSheet/", companyController.insertOrUpdateEvaluationSheet);

module.exports = router;
