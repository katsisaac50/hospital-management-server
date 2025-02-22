// DischargeForm model
const mongoose = require('mongoose');

const dischargeFormSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  forms: [
    {
      finalDiagnosis: String,
      medicationsOnDischarge: [String],
      followUpAppointments: [{ date: String, reason: String }],
      dischargeInstructions: String,
      doctorNotes: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const DischargeForm = mongoose.model('DischargeForm', dischargeFormSchema);

module.exports = DischargeForm;
