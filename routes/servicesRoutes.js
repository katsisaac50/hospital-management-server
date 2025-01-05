const express = require('express');
const { getServices} = require('../controllers/servicesController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();



// Get overall statistics
router.route('/services')
.get(protect, getServices);

module.exports = router;