const mongoose = require('mongoose');

const dispensedProductSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User model
  dispensedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DispensedProduct', dispensedProductSchema);
