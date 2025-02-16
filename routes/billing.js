const express = require("express");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const Billing = require("../models/Billing");

const router = express.Router();

// ✅ Only Admins can access billing
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const billingData = await Billing.find();
    res.json(billingData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
