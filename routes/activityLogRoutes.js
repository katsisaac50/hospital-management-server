const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const { getactivityLogs, createActivityLog } = require('../controllers/activityLogsController');

const router = express.Router();

router.get("/", protect, getactivityLogs);

router.post("/", protect, createActivityLog);

module.exports = router; // Use `module.exports` instead of `export default`
