const Invoice = require('../models/invoice.model');

// 📌 Create Invoice
const createInvoice = async (req, res) => {
  try {
    const {  invoiceNumber, patient, doctor, services, paymentMethod, dueDate, notes } = req.body;

    // Calculate total amount
    const totalAmount = services.reduce((total, service) => total + service.cost, 0);

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      patient,
      doctor,
      services,
      totalAmount,
      amountPaid: 0, // Default to 0 at creation
      paymentStatus: 'Pending',
      paymentMethod,
      dueDate,
      notes,
    });

    const savedInvoice = await invoice.save();
    res.status(201).json({ success: true, data: savedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating invoice', error });
  }
};

// 📌 Pay Invoice
const payInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  const { amountPaid, paymentMethod } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Update the amount paid
    invoice.amountPaid += amountPaid;

    // Determine payment status
    if (invoice.amountPaid >= invoice.totalAmount) {
      invoice.paymentStatus = 'Paid';
      invoice.amountPaid = invoice.totalAmount; // Ensure it doesn’t exceed total
    } else {
      invoice.paymentStatus = 'Partial';
    }

    invoice.paymentMethod = paymentMethod;

    await invoice.save();

    res.json({ success: true, message: 'Payment recorded successfully', invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInvoices = async (req, res) => {
    try {
      const invoices = await Invoice.find()
        .populate('patient', 'name email')
        .populate('doctor', 'name email');
  
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching invoices', error });
    }
  };
  
module.exports ={createInvoice, getInvoices, payInvoice}