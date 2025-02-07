const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['medicine', 'equipment'], required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  batchNumber: { type: String },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
