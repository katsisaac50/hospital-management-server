const Patient = require('../models/patient');

// Get all patients
const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find(); // Fetch all patients from the database
        res.status(200).json(patients); // Return the patients as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return error if something goes wrong
    }
};

// Get patient by ID
const getPatientById = async (req, res) => {
    try {
        const patientId = req.params.id; // Extract the patient ID from the request parameters
        const patient = await Patient.findById(patientId); // Find the patient by ID

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' }); // Patient not found
        }

        res.json(patient); // Return the patient details as a JSON response
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ message: 'Server error' }); // Server error
    }
};

// Add a new patient
const addPatient = async (req, res) => {
    try {
        const { name, age, gender, contact } = req.body; // Extract data from the request body
        const patient = new Patient({ name, age, gender, contact }); // Create a new patient object
        const createdPatient = await patient.save(); // Save the patient to the database
        res.status(201).json(createdPatient); // Return the created patient as JSON response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Bad request error if validation fails
    }
};

module.exports = { getPatients, addPatient, getPatientById };
