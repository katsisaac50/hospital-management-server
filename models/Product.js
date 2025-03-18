const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['medicine', 'equipment'], required: true },
  description: { type: String },
  dosageForm: String,
  strength: String,
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  priceHistory: [
    {
      price: Number,
      date: { type: Date, default: Date.now }, // ⏳ Track when price changed
    }
  ],
  batchNumber: { type: String, required: true },  // Unique batch number for each batch
  expiryDate: { type: Date, required: true },  // Expiration date per batch
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
