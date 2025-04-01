const Service = require('../models/Service');

// Update user role (admin only)
const getServices = async (req, res) => {
  console.log('babii')
    try {
      const services = await Service.find();
      console.log("services",services);
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching services', error });
    }
  };

  const deleteService = async (req, res) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  };

  module.exports = {
    getServices
  };