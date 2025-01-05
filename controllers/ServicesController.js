// Update user role (admin only)
const getServices = async (req, res) => {
    try {
      const services = await Service.find();
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching services', error });
    }
  };

  module.exports = {
    getServices
  };