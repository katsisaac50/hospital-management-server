const express = require('express');
const router = express.Router();
const { getAllMedicalTests, insertDefaultTests } = require('../controllers/medicalTestController');

// Fetch all tests with reference values
router.get('/', getAllMedicalTests);
router.post('/', insertDefaultTests)


module.exports = router;
