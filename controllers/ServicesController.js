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

  module.exports = {
    getServices
  };