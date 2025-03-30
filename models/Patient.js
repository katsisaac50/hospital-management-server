const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the User schema
      required: true,
    },
  patientID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact: { type: String, required: true },
  status: { type: String },
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
  currentDiagnosis: { type: String }, 
  treatment: { type: String },           
  laboratory: { type: String },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      price: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
