const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "invoice"
  seq: { type: Number, default: 1000 }, // Starting invoice number
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
