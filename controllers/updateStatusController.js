const mongoose = require("mongoose");
const TestResult = require("../models/medicalTestResults");

const updateTestStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const { user, testStatus } = req.body;
    console.log('here status', testId, user, testStatus);
    if (user.role !== "labTechnician") {
      return res.status(403).json({ error: "Access Denied" });
    };

    if (!testId || !result) {
      return res.status(400).json({ error: 'Test ID and result are required' });
    };

    const test = await TestResult.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });
console.log('am here')
    if (test.testStatus === "completed" && testStatus !== "completed") {
      return res.status(400).json({ error: "Completed tests cannot be modified" });
    };

    test.testStatus = testStatus || test.testStatus;
    console.log('test', test);
    await test.save();

    res.json({ message: "Test updated successfully", test });
  } catch (error) {
    console.error("Error updating test status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  };

  module.exports = { updateTestStatus };