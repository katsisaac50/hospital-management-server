const mongoose = require("mongoose");
const TestResult = require("../models/medicalTestResults");

const updateTestStatus = async (req, res) => {
  try {
    console.log('hehe', req.body);

    const { testId } = req.params;
    const { user, testStatus, result, doctorId } = req.body; // Extract result properly
    console.log('here status', testId, user, testStatus, result);

    if (!user || !user.role) {
      return res.status(403).json({ error: "User information is required" });
    }

    if (user.role !== "labTechnician") {
      return res.status(403).json({ error: "Access Denied" });
    };

    if (!testId) {
      return res.status(400).json({ error: 'Test ID is required' });
    }

    const test = await TestResult.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });

    console.log('am here 1')

    // Prevent modifying a completed test
    if (test.testStatus === "completed" && testStatus !== "completed") {
      return res.status(400).json({ error: "Completed tests cannot be modified" });
    }

    // If marking test as "completed", result must be provided
    if (testStatus === "completed" && !result) {
      return res.status(400).json({ error: "Result is required when completing a test" });
    }

    test.testStatus = testStatus || test.testStatus;
    if (result) {
      test.result = result;
    }

    console.log('test', test);
    await test.save();

    res.json({ message: "Test updated successfully", test });
  } catch (error) {
    console.error("Error updating test status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { updateTestStatus };
