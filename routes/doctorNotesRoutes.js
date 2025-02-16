const express = require('express');
const { doctorNotes } = require('../controllers/doctorNotesController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to get all doctors notes
router.route('/')
    .post( doctorNotes);  // Add a new patient

module.exports = router;