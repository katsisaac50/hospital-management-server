const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  referenceValue: { type: String, required: true },  // Standard reference value, e.g., "120/80 mmHg"
  unit: { type: String, required: true },
  category: { type: String, required: true },
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;