const mongoose = require('mongoose');

const doctorNotesSchema = new mongoose.Schema({
    testResult: { type: mongoose.Schema.Types.ObjectId, ref: "TestResult", required: true },
    specialInstructions: { type: String },
    diagnosisHypothesis: { type: String },
  });
  
  export const DoctorNote = mongoose.model("DoctorNote", doctorNotesSchema);