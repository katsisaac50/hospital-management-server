const express = require('express');
const { getServices} = require('../controllers/servicesController');
const Service = require('../models/Service');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();


// Create a new service
router.post('/', async (req, res) => {
    const { name, description, price } = req.body;
  
    try {
      const service = new Service({ name, description, price });
      await service.save();
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create service' });
    }
  });

// Get overall statistics
router.route('/')
.get( getServices);
// .get(protect, getServices);

// Get a single service
router.get('/:id', async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  });

  router.delete('services/:id', async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  });

module.exports = router;