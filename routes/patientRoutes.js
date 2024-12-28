const express = require('express');
const { getPatients, addPatient, getPatientById } = require('../controllers/patientController');
const router = express.Router();

// Route to get all patients
router.route('/')
    .get(getPatients)   // Get all patients
    .post(addPatient);  // Add a new patient

// Route to get a patient by ID
router.route('/:id')
    .get(getPatientById); // Get a specific patient by ID

module.exports = router;

