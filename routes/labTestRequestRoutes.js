const express = require('express');
const router = express.Router();
const {labTestRequest } = require('../controllers/medicalTestResultController');
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.post('/', labTestRequest);

module.exports = router;