const express = require('express');
const { getPatients, addPatient, getPatientById, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get all patients
router.route('/')
    .get(protect, getPatients)   // Get all patients
    .post(protect, addPatient);  // Add a new patient

// Route to get a patient by ID
router.route('/:id')
    .get(protect, getPatientById) // Get a specific patient by ID
    .put(protect, updatePatient) // Update patient details
    .delete(protect, deletePatient); //Delete patient

module.exports = router;

