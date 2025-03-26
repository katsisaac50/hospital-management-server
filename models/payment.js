const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  amount_paid: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  payment_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  payment_method: {
    type: String,
    enum: ['cash', 'card', 'mobile_money', 'bank_transfer'],
    required: true
  }
});

module.exports = mongoose.model('Payment', paymentSchema);