const mongoose = require('mongoose');

// Define the Invoice schema
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', // Reference to the Patient model
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (with role: doctor)
      required: true
    },
    services: [
      {
        description: {
          type: String,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'insurance', 'bank_transfer'],
      default: 'cash',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save middleware to calculate the total amount
invoiceSchema.pre('save', function (next) {
  if (this.services && this.services.length > 0) {
    this.totalAmount = this.services.reduce((sum, service) => sum + service.cost, 0);
  }
  next();
});

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
