const express = require('express');
const { getPatients, addPatient, getPatientById } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get all patients
router.route('/')
    .get(protect, getPatients)   // Get all patients
    .post(protect, addPatient);  // Add a new patient

// Route to get a patient by ID
router.route('/:id')
    .get(protect, getPatientById); // Get a specific patient by ID

module.exports = router;

