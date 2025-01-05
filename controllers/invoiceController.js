const Invoice = require('../models/Invoice');

const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, patient, doctor, services, paymentStatus, paymentMethod, dueDate, notes } = req.body;

    // Calculate totalAmount
    const totalAmount = services.reduce((total, service) => total + service.cost, 0);

    const invoice = new Invoice({
      invoiceNumber,
      patient,
      doctor,
      services,
      totalAmount,
      paymentStatus,
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
  
module.exports ={createInvoice, getInvoices}