const express = require('express');
const { getPatients, addPatient, getPatientById, getPatientByIdLab, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get all patients
router.route('/')
    .get(protect, authorizeRoles('admin', 'doctor', 'nurse', "labTechnician"), getPatients)   // Get all patients
    .post(protect, addPatient);  // Add a new patient

// ❌ Lab Technicians can only view minimal patient info
router.get("/lab/:id", protect, authorizeRoles("labTechnician"), getPatientByIdLab);

// Route to get a patient by ID
router.route('/:id')
    .get(protect, getPatientById) // Get a specific patient by ID
    .put(protect, updatePatient) // Update patient details
    .delete(protect, deletePatient); //Delete patient

module.exports = router;

