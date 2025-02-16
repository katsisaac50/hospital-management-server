const Patient = require('../models/Patient');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const getNextPatientId = require('./idCounterController')

// Add a new patient and create a user record
const addPatient = async (req, res) => {
  
  try {
  // Note: Remember to remove patientId from the frontend input because it's made automatic now
    const {
      name,
      dob,
      gender,
      contact,
      email,
      password, // Password for user authentication
      emergencyContact,
      address,
      medicalHistory,
      insurance,
      allergies,
      bloodType,
      maritalStatus,
      occupation,
      physicalExamination,
      treatment,
      laboratory,
    } = req.body;

    // Validate required fields
    if (!name || !dob || !gender || !contact || !email || !password) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if a user or patient with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user with the role 'patient'
    const user = await User.create({
      name,
      email,
      password,
      role: 'patient',
    });

    const newPatientId = await getNextPatientId();
    // Create the patient record linked to the user
    const patient = new Patient({
      user: user._id,
      patientID: newPatientId,
      name,
      dob,
      gender,
      contact,
      email,
      emergencyContact,
      address,
      medicalHistory,
      insurance,
      allergies,
      bloodType,
      maritalStatus,
      occupation,
      physicalExamination,
      treatment,
      laboratory,
    });

    // Save the patient to the database
    const createdPatient = await patient.save();

    res.status(201).json({
      message: 'Patient and user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Optional: Return a token for authentication
      },
      patient: createdPatient,
    });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Failed to add patient.', error: error.message });
  }
};

// Get all patients

const getPatients = async (req, res) => {
console.log('bab')
  try {
    const patients = await Patient.find().populate('user', 'name email role');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient by ID

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email role');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPatientByIdLab = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email role');
    // const patients = await Patient.find().select("fullName patientId dateOfBirth gender");
    // res.json(patients);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update patient details

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      dob,
      gender,
      contact,
      currentDiagnosis,
      treatment,
      physicalExamination,
      laboratory,
      medicalHistory,
    } = req.body;

    console.log(req.body);
  
    // Validate incoming data (optional: use a validation library like Joi)
    if (!name || !dob || !gender || !contact) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
  
    try {
      // Find the patient by ID and update their details
      const updatedPatient = await Patient.findByIdAndUpdate(
        id,
        {
          name,
          dob,
          gender,
          contact,
          currentDiagnosis,
          treatment,
          physicalExamination,
          laboratory,
          medicalHistory,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ error: 'Patient not found.' });
      }
  
      res.status(200).json({
        message: 'Patient details updated successfully.',
        patient: updatedPatient,
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  };

  // Delete patient

  const deletePatient = async (req, res) => {

    await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: 'Patient deleted' });

  };

module.exports = { getPatients, addPatient, getPatientById, getPatientByIdLab, updatePatient, deletePatient };


