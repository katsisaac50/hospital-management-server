const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    
}, {
    timestamps: true,
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
