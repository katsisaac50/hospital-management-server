const express = require('express');
const router = express.Router();
const Payment = require('../models/payment'); // Assuming your payment model is in models/payment.js
const Transaction = require('../models/transaction'); // Assuming your transaction model is in models/transaction.js

// Create Payment
router.post('/payments', async (req, res) => {
  try {
    const { patient_id, amount_paid, balance, total, payment_method } = req.body;

    const payment = new Payment({
      patient_id,
      amount_paid,
      balance,
      total,
      payment_method
    });

    await payment.save();

    // Log the transaction
    const transaction = new Transaction({
      payment_id: payment._id,
      transaction_type: 'payment',
      amount: amount_paid
    });
    await transaction.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Payments by Patient
router.get('/payments/:patientId', async (req, res) => {
  try {
    const payments = await Payment.find({ patient_id: req.params.patientId }).populate('patient_id');
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Payments (for admin/finance section)
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().populate('patient_id');
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;