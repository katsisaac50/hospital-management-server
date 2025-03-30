const express = require("express");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const Billing = require("../models/Billing");

const router = express.Router();

router.post("/", async (req, res) => {

  console.log("one love", req.body)
  try {
    const { patientId, services, total, discount, paymentStatus, date, name, paid, balance, transactionType, notes } = req.body;

    // Calculate finalAmount (this logic can be adjusted based on your requirements)
    const finalAmount = total - discount;

    const newPayment = new Billing({
      patientId,
      services,
      totalAmount: total,
      discount,
      finalAmount,
      paymentStatus,
      date,
      name,
      paid,
      balance,
      transactionType,
      notes,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
});

/* protect, authorizeRoles("admin") */
// ✅ Only Admins can access billing
router.get("/",  async (req, res) => {
  try {
    const { sortBy = "createdAt", order = "desc", patientId } = req.query;
    let filter = {};

    if (patientId) {
      filter.patientId = patientId;
    }

    const payments = await Billing.find(filter)
      .populate("patientId", "fullName") // Show patient name
      .sort({ [sortBy]: order });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const payment = await Billing.findById(req.params.id).populate("patientId", "fullName");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const payment = await Billing.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    Object.assign(payment, req.body);
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
});


module.exports = router;
