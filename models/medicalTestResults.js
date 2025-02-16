const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },  // Reference to the test
  result: { type: String, required: true },  // Technician's finding
  testStatus: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" },
  date: { type: Date, default: Date.now },  // When the result was entered
  sampleType: { type: String },
  sampleCollectionDate: { type: Date },
  testNotes: { type: String },
  diagnosisHypothesis: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  history: [{
    result: String,
    updatedAt: { type: Date, default: Date.now },
  }]
});

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
