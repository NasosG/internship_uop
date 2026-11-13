const express = require('express');
const router = express.Router();
const atlasController = require("../controllers/atlasController.js");
const checkAuth = require("../middleware/auth.js");
const { checkUniversityUser, checkStaff } = require("../middleware/access.js");

// router.get('/getAvailablePositionGroups/:begin', atlasController.getAvailablePositionGroups);
// router.post('/getRegisteredStudents/', atlasController.getRegisteredStudents);

// Positions search: students and department managers
router.get('/getAvailablePositionGroups/:begin', checkUniversityUser, atlasController.getAvailablePositionGroupsUI);
router.post('/getAtlasFilteredPositions/:begin', checkUniversityUser, atlasController.getAtlasFilteredPositions);
router.get('/getGenericPositionSearch/', checkUniversityUser, atlasController.getGenericPositionSearch);
router.get('/getStudentPositionMatchesAcademic', checkUniversityUser, atlasController.getStudentPositionMatchesAcademic);

// Lists for the forms, also used by companies (position upload): every logged in user
router.get('/getInstitutions', checkAuth, atlasController.getInstitutions);
router.get('/getAEIInstitutions', checkAuth, atlasController.getAEIInstitutions);
router.get('/getCities', checkAuth, atlasController.getCities);
router.get('/getPrefectures', checkAuth, atlasController.getPrefectures);
router.get('/getCountries', checkAuth, atlasController.getCountries);
router.get('/getPhysicalObjects', checkAuth, atlasController.getPhysicalObjects);

// Assigned positions: department managers, office and admin
router.get('/getAssignedPositionById/:id', checkStaff, atlasController.getAssignedPositionByIdHandler);
router.post('/changeImplementationDatesAtlas/:id', checkStaff, atlasController.changeImplementationDatesAtlas);
router.post('/completeAtlasPosition/:id', checkStaff, atlasController.completeAtlasPosition);

// Admin panel (for now also every university user)
router.post('/sync/position/:id', checkUniversityUser, atlasController.syncAtlasPositionGroup);

// Manual sync of the Atlas tables (the scheduled sync in app.js calls the controller directly)
router.get('/insertTablesFromAtlas', atlasController.insertTablesFromAtlas);

// Not used by the app, kept for manual runs (for now every university user, to be restricted further)
router.get('/insertPositionGroup/', checkUniversityUser, atlasController.insertPositionGroup);
router.get('/getRegisteredStudent/', checkUniversityUser, atlasController.getRegisteredStudent);
router.get('/getFundingTypes', checkUniversityUser, atlasController.getFundingTypes);
router.get('/testDeletePosition', checkUniversityUser, atlasController.testDeletePosition);
router.get('/getRegisteredStudents', checkUniversityUser, atlasController.getRegisteredStudents);
router.get('/getStudentAcademicId', checkUniversityUser, atlasController.getStudentAcademicId);
router.get('/getAssignedPositions', checkUniversityUser, atlasController.getAssignedPositions);

module.exports = router;
