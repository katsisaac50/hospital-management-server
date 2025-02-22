const express = require('express');
const router = express.Router();
const { getDischargeForm, createDischargeForm, editDischargeForms, deleteDischargeForm } = require('../controllers/dischargeFormController');

// Fetch all tests with reference values
router.get('/', getDischargeForm);
router.post('/', createDischargeForm);
router.put('/:formIndex', editDischargeForms);
router.delete('/:formIndex',  deleteDischargeForm);


module.exports = router;