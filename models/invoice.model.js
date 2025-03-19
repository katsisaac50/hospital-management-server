const mongoose = require('mongoose');
const Counter = require('./counter.model'); // Import the counter model

// Define the Invoice schema
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    services: [
      {
        description: { type: String, required: true },
        cost: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid', 'Pending', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Insurance', 'Bank Transfer', 'Mobile Money'],
      default: 'Cash',
    },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-generate Invoice Number
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'invoice' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.invoiceNumber = `INV-${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }

  // Calculate total amount
  if (this.services && this.services.length > 0) {
    this.totalAmount = this.services.reduce((sum, service) => sum + service.cost, 0);
  }

  next();
});

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
