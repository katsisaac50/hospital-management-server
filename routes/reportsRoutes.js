const express = require('express');
const { getStatistics, getDoctorReports, getFinanceReports, getPatientReports } = require('../controllers/reportsController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();



// Get overall statistics
router.route('/statistics')
.get(protect, getStatistics);

// Get doctor-specific interaction reports
router.route('/doctor/:id')
.get(protect, getDoctorReports);

// Get financial reports
router.route('/finance')
.get(protect, getFinanceReports);

// Get patient-specific reports
router.route('/patient/:id')
.get(protect, getPatientReports);

module.exports = router;
