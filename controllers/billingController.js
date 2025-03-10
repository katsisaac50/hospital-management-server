const express = require('express');
const Billing = require('../models/Billing');
const router = express.Router();

// Create a new bill
const createBill = async (req, res) => {
  try {
    const { patientId, services, totalAmount, discount } = req.body;
    const finalAmount = totalAmount - (discount || 0);

    const newBill = new Billing({
      patientId,
      services,
      totalAmount,
      discount,
      finalAmount,
      paymentStatus: 'Pending',
    });

    await newBill.save();
    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill', error });
  }
);

// Mark a bill as paid
const billAsPaid = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const bill = await Billing.findById(req.params.billId);

    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    if (bill.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Bill is already paid' });
    }

    bill.paymentStatus = 'Paid';
    bill.paymentMethod = paymentMethod;
    bill.paidAt = new Date();
    bill.receiptNumber = `RCPT-${Date.now()}`;
    await bill.save();

    res.json({ message: 'Payment successful', receipt: bill.receiptNumber });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

// Fetch patient bills
Const getPatientBills async (req, res) => {
  try {
    const bills = await Billing.find({ patientId: req.params.patientId });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills', error });
  }
};

// Get a specific receipt
GetSpecificPatientReceipt =  async (req, res) => {
  try {
    const bill = await Billing.findOne({ receiptNumber: req.params.receiptNumber });
    if (!bill) return res.status(404).json({ message: 'Receipt not found' });

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receipt', error });
  }
};

module.exports = router;
