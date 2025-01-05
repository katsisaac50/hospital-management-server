const express = require('express');
const { getInvoices, createInvoice} = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get all invoices
router.route('/')
    .get(getInvoices)   // Get all invoices
    .post(createInvoice);  // create invoices
    
module.exports = router;