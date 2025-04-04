const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },  // totalAmount - discount
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending" },
  paymentMethod: { type: String, enum: ["Cash", "Card", "Mobile Money", "Insurance"], default: "Cash" },
  receiptNumber: { type: String, unique: true, sparse: true }, // Generated upon payment
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
  
  // New fields
  date: { type: Date, required: true },  // Stores the payment date
  name: { type: String, required: true }, // Stores the person's name
  paid: { type: Number, required: true },  // The amount they have paid
  balance: { type: Number, required: true }, // The remaining balance
  total: { type: Number, required: true },  // The total amount due
  transactionType: { type: String, enum: ["TT", "Cash", "Cleared", "Other"], default: "Cash" }, // Specifies if it’s TT (Transfer), Cash, Cleared, or Other
  notes: { type: String, default: "" },  // Stores additional remarks if necessary
});

// Generate a unique receipt number
billingSchema.pre("save", function (next) {
  if (this.paymentStatus === "Paid" && !this.receiptNumber) {
    this.receiptNumber = `RCPT-${Date.now()}`;
  }
  next();
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
