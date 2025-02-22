const express = require('express');
const router = express.Router();
const { AddMedicalTests, GetTestResults, 
        updateMedicalTestResults, 
        deleteMedicalTestResults, 
        bulkUpdateLabResults,
        labTestRequest } = require('../controllers/medicalTestResultController');
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Save test result entered by technician
router.route('/:id')
        .post(protect, authorizeRoles("labTechnician"), AddMedicalTests)
        .put(protect, authorizeRoles("labTechnician"), updateMedicalTestResults);
router.get('/', protect, authorizeRoles("labTechnician", "doctor"), GetTestResults);
router.delete("/:testId", protect, authorizeRoles("labTechnician"), deleteMedicalTestResults);
router.put('/bulkUpdate', bulkUpdateLabResults);


module.exports = router;
