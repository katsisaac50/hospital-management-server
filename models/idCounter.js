const mongoose = require('mongoose');

const idCounterSchema = new mongoose.Schema({
    collectionName: { type: String, required: true, unique: true },
    counter: { type: Number, default: 0 },
  });
  
  const IdCounter = mongoose.model('IdCounter', idCounterSchema);
  
  module.exports = IdCounter;