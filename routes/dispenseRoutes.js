const express = require('express');
const router = express.Router();
const DispensedProduct = require('../models/DispensedProduct');
const Product = require('../models/Product');
const Patient = require('../models/Patient');
const User = require('../models/User'); // If dispensers are stored as Users

// Fetch all dispensed products with necessary details
router.get('/dispensed', async (req, res) => {
    console.log('despensed')
  try {
    const dispensedProducts = await DispensedProduct.find()
      .populate('patientId', 'name') // Get Patient Name
      .populate('productId', 'name price') // Get Medication Name & Price
      .populate('dispensedBy', 'name') // Get Dispenser (User)
      .sort({ dispensedAt: -1 }); // Sort by latest first
      

    if (!dispensedProducts.length) {
      return res.status(404).json({ message: 'No dispensed products found' });
    }
    

    const formattedData = dispensedProducts.map((med) => {
        const dispensedAt = new Date(med.dispensedAt);
        const formattedDate = dispensedAt.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  console.log(med)
        return {
            // Map the results to match frontend requirements
            patientName: med.patientId?.name || "Unknown Patient",
            medicationName: med.productId?.name || "Unknown Product",
            dosage: med.dosage || "N/A",
            quantity: med.quantity,
            price: med.productId?.price || 0,
            totalPrice: med.totalCost,
            dateDispensed: formattedDate,
            dispensedBy: med.dispensedBy.name, // Who dispensed it
        //   prescribingDoctor: med.dispensedBy?.fullName || "Unknown Doctor",
        };
      });
    //   // Map the results to match frontend requirements
    // const formattedProducts = dispensedProducts.map((med) => ({
    //     patientName: med.patientId?.name || "Unknown Patient",
    //     medicationName: med.productId?.name || "Unknown Product",
    //     quantity: med.quantity,
    //     price: med.productId.price,
    //     totalPrice: med.totalCost,
    //     dateDispensed: med.dispensedAt,
    //     dispensedBy: med.dispensedBy.name, // Who dispensed it
    //   }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching dispensed products:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;