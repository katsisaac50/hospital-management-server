const express = require('express');
const { updateTestStatus } = require('../controllers/updateStatusController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router()

// Update test status
router.put('/:testId', updateTestStatus);
module.exports = router;