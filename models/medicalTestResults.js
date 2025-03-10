const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test', // Assuming you have a Test model
    required: function() {
      return this.isLabTechnician;  // Only required for lab technicians
    }
  },
  // testName: { type: String },  // Remove `required: true` since it's auto-filled
  testStatus: { type: String, enum: ["requested", "pending", "in_progress", "completed"], default: "requested" },
  date: { type: Date, default: Date.now },
  sampleType: { type: String },
  sampleCollectionDate: { type: Date },
  testNotes: { type: String },
  diagnosisHypothesis: { type: String },
  result: {
    type: String,
    required: function() {
      return this.isLabTechnician;  // Only required for lab technicians
    }
  },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testConclusion: { type: String },
  resultDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
  history: [{
    result: String,
    updatedAt: { type: Date, default: Date.now },
  }]
});

// virtual field in TestResult to retrieve the reference value dynamically
testResultSchema.virtual('referenceValue', {
  ref: 'Test',
  localField: 'testId',
  foreignField: '_id',
  justOne: true,
});

// Middleware to sync `testName` before saving
testResultSchema.pre('save', async function (next) {
  if (this.isModified('testId') || this.isNew) {
    const test = await mongoose.model('Test').findById(this.testId);
    if (test) {
      this.testName = test.testName;
    } else {
      return next(new Error('Invalid testId: Test not found.'));
    }
  }
  next();
});


const TestResult = mongoose.model('TestResult', testResultSchema);
module.exports = TestResult;


