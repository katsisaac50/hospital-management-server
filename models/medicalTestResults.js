const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Doctor requesting the test
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  testName: { type: String, required: true },  // Name of the test
  testStatus: { type: String, enum: ["requested", "pending", "in_progress", "completed"], default: "requested" },  // Status flow
  date: { type: Date, default: Date.now },  // When the result was entered
  sampleType: { type: String },
  sampleCollectionDate: { type: Date },
  testNotes: { type: String },  // Notes from doctor
  diagnosisHypothesis: { type: String },  // Doctor's hypothesis
  result: { type: String, required: true },  // Lab technician’s finding
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Who processed the test
  resultDate: { type: Date },  // When the result was recorded
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  history: [{
    result: String,
    updatedAt: { type: Date, default: Date.now },
  }]
});


const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;

