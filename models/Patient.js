const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  patientID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emergencyContact: { type: String },
  address: { type: String },
  medicalHistory: { type: String },
  insurance: { type: String },
  allergies: { type: String },
  bloodType: { type: String },
  maritalStatus: { type: String },
  occupation: { type: String },
  physicalExamination: { type: String },
  treatment: { type: String },           
  laboratory: { type: String },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
