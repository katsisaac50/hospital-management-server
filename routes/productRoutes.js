const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const DispensedProduct = require('../models/DispensedProduct');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const product = new Product(req.body);
console.log(product)
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product stock
router.put('/:id', async (req, res) => {
  console.log('the gang', req.params)
  const { id:productId } = req.params;
  const updateData = req.body;

  try {
    let product = await Product.findById(productId);
    // console.log('prod', product, "update", updateData)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Track price changes
    console.log("price", updateData.price , "pro", product.price)
    if (updateData.price && updateData.price !== product.price) {
      if (!product.priceHistory) {
        product.priceHistory = [];  // Initialize the array if it's not already defined
      }
      product.priceHistory.push({ price: updateData.price });
    }

    // Update product details
    Object.assign(product, updateData);

    await product.save();
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error });
  }
});

// Dispense medicine
router.post('/:id/dispense', async (req, res) => {

  try {
    const { id : productId } = req.params;
    const { quantity, userId } = req.body;

    const product = await Product.findById(productId);

    console.log('product', product)
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    const totalCost = product.price * quantity; // 💰 Total cost calculation
    product.quantity -= quantity;
    
    await product.save();
    
    const dispensedProduct = new DispensedProduct({
      productId,
      quantity,
      totalCost,
      dispensedBy: userId, // user who dispensed the product
      dispensedAt: new Date(), // current date/time
    });

    await dispensedProduct.save(); // Save the dispensing record

    res.json({
      message: 'Product dispensed successfully',
      product,
      totalCost,
      dispensedProduct,
    });
  } catch (error) {
    console.error("Error dispensing product:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Product Price with History Tracking
// app.post('/update-price/:productId', async (req, res) => {
//   const { productId } = req.params;
//   const { newPrice } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     // Store old price in history
//     product.priceHistory.push({ price: product.price });

//     // Update current price
//     product.price = newPrice;
//     await product.save();

//     res.json({ message: 'Price updated successfully', newPrice });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

//  Integrate with Billing & Invoices
// async function addToBill(patientId, medicineId, quantity) {
//   const medicine = await Medicine.findById(medicineId);
//   if (!medicine) throw new Error('Medicine not found');

//   const cost = medicine.price * quantity;

//   const invoice = new Invoice({
//     patientId,
//     items: [{ name: medicine.name, price: medicine.price, quantity, total: cost }],
//     totalAmount: cost
//   });

//   await invoice.save();
// }

// View Price History
// app.get('/medicine-price-history/:medicineId', async (req, res) => {
//   const { medicineId } = req.params;

//   try {
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

//     res.json({ name: medicine.name, currentPrice: medicine.price, priceHistory: medicine.priceHistory });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Add Supplier Prices When Restocking
router.post('/restock-product/:productId', async (req, res) => {
  const { productId } = req.params;
  console.log("pdct",productId)
  const { supplierName, contact, purchasePrice, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Add supplier details
    product.suppliers.push({
      name: supplierName,
      contact,
      purchasePrice,
      lastPurchased: new Date(),
    });

    // Increase stock
    product.quantity += quantity;
    await product.save();

    res.json({ message: 'Medicine restocked successfully', newStock: product.quantity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View Supplier Prices & Compare
// app.get('/medicine-suppliers/:medicineId', async (req, res) => {
//   const { medicineId } = req.params;

//   try {
//     const medicine = await Medicine.findById(medicineId);
//     if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

//     res.json({ medicine: medicine.name, suppliers: medicine.suppliers });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Choose the Cheapest Supplier When Restocking
// async function getCheapestSupplier(medicineId) {
//   const medicine = await Medicine.findById(medicineId);
//   if (!medicine) throw new Error('Medicine not found');

//   // Sort suppliers by purchase price (cheapest first)
//   const cheapestSupplier = medicine.suppliers.sort((a, b) => a.purchasePrice - b.purchasePrice)[0];

//   return cheapestSupplier;
// }

// Generate Reports on Supplier Spending
// app.get('/supplier-spending', async (req, res) => {
//   try {
//     const medicines = await Medicine.find();

//     let spendingReport = {};

//     medicines.forEach(med => {
//       med.suppliers.forEach(supplier => {
//         if (!spendingReport[supplier.name]) spendingReport[supplier.name] = 0;
//         spendingReport[supplier.name] += supplier.purchasePrice;
//       });
//     });

//     res.json(spendingReport);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


 module.exports = router;
