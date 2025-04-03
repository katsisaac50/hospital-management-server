const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { getNextPatientId } = require('./idCounterController');

// Add a new patient and create a user record
const addPatient = async (req, res) => {
  try {
    const {
      name, dob, gender, status, contact, emergencyContact, address,
      medicalHistory, insurance, allergies, bloodType, maritalStatus, occupation,
      physicalExamination, treatment, laboratory, services
    } = req.body;

console.log(services);

    // Validate required fields
    if (!name || !dob || !gender || !contact) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Default password setup
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create a new user
    const user = await User.create({
      name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      role: 'patient',
    });

    // Get the next Patient ID
    const newPatientId = await getNextPatientId();

    // Loop through the services array and ensure services have a valid `serviceId`
    const newServices = [];
    for (const service of services) {
      // Check if service already exists by name
      let foundService = await Service.findOne({ name: service.serviceName });

      // If service does not exist, create it
      if (!foundService) {
        foundService = new Service({
          name: service.serviceName,
          description: service.description,
          price: service.price,
        });

        await foundService.save();
      }

      // Push the service with its generated `serviceId`
      newServices.push({
        serviceId: foundService._id, // The `serviceId` from the MongoDB _id
        price: service.price || foundService.price, // Use the price from the request or from the service if not provided
      });
    }

    // Create the patient record with linked services
    const patient = new Patient({
      user: user._id,
      patientID: newPatientId,
      name, dob, gender, status, contact, emergencyContact, address,
      medicalHistory, insurance, allergies, bloodType, maritalStatus, occupation,
      physicalExamination, treatment, laboratory, services: newServices,
    });

    // Save the patient to the database
    const createdPatient = await patient.save();

    // Respond with success
    res.status(201).json({
      message: 'Patient and user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        defaultPassword,
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
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID (Lab version)
const getPatientByIdLab = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email role');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient details
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, dob, gender, contact, currentDiagnosis, treatment, physicalExamination, laboratory, medicalHistory } = req.body;

  if (!name || !dob || !gender || !contact) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { name, dob, gender, contact, currentDiagnosis, treatment, physicalExamination, laboratory, medicalHistory },
      { new: true }
    );

    if (!updatedPatient) return res.status(404).json({ error: 'Patient not found.' });

    res.status(200).json({ message: 'Patient updated successfully.', patient: updatedPatient });
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