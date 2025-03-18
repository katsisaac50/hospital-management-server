const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Dispense medicine
router.post('/:id/dispense', async (req, res) => {

  try {
    const { id : productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);

    console.log('product', product)
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    const totalCost = product.price * quantity; // 💰 Total cost calculation
    product.quantity -= quantity;
    
    await product.save();
    console.log("HDLDFD", product)
    res.json({ message: 'Product dispensed', product , totalCost });
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
app.post('/update-price/:productId', async (req, res) => {
  const { productId } = req.params;
  const { newPrice } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Store old price in history
    product.priceHistory.push({ price: product.price });

    // Update current price
    product.price = newPrice;
    await product.save();

    res.json({ message: 'Price updated successfully', newPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
