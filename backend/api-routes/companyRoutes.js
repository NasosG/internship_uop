const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController.js");
const checkAuth = require("../middleware/auth.js");

router.get("/getProviderByAfm/:afm", companyController.getProviderByAfm);
router.get("/getProviderByAfmAndName/", checkAuth, companyController.getProviderByAfmAndName);
router.get("/getProviderById/:id", checkAuth, companyController.getProviderById);
router.get("/getStudentActiveApplications/", checkAuth, companyController.getStudentActiveApplications);
router.get("/getStudentAssignedApplications/", checkAuth, companyController.getStudentAssignedApplications);
router.get("/getInternalPositionsByProviderId/:id", checkAuth, companyController.getInternalPositionsByProviderId);
router.get("/getCompanysEvaluationForm/", checkAuth, companyController.getCompanysEvaluationForm);
router.post("/insertCompanyUser/", companyController.insertCompanyUsers);
router.post("/insertNewAssignment/:id", checkAuth, companyController.insertAssignment);
router.post("/insertInternalPosition/:id", checkAuth, companyController.insertInternalPositionGroup);
router.post("/login/", companyController.login);
router.post("/resetPassword/", companyController.resetPassword);
router.get("/getProviderByPositionId/:id", checkAuth, companyController.getProviderByPositionId);
router.post("/insertOrUpdateEvaluationSheet/", checkAuth, companyController.insertOrUpdateEvaluationSheet);

module.exports = router;
