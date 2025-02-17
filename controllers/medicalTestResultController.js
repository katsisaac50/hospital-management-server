const mongoose = require("mongoose");
const TestResult = require("../models/medicalTestResults");

const AddMedicalTests = async (req, res) => {
  // console.log(req.body);
  try {
    const { patientId, testId, result } = req.body;

    if (!patientId || !testId || !result) {
      return res.status(400).send("Missing required fields");
    }

    // Convert string IDs to ObjectId correctly
    const patientObjectId = new mongoose.Types.ObjectId(patientId);
    const testObjectId = new mongoose.Types.ObjectId(testId);

    const newTestResult = new TestResult({
      patientId: patientObjectId,
      testId: testObjectId,
      result,
    });

    await newTestResult.save();

    res.status(200).json(newTestResult); // Return saved result
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ message: "Error saving test result", error });
  }
};

const GetTestResults = async (req, res) => {
  try {
    
    const { patientId } = req.query; // Get patientId from query params
    // console.log("gooo", patientId)
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const testResults = await TestResult.find({ patientId })
      .populate("testId", "testName referenceValue unit category") // Join test details
      .sort({ createdAt: -1 }); // Sort newest first
// console.log("testResults", testResults)
    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ message: "Error fetching test results", error });
  }
};

const updateMedicalTestResults = async (req, res) => {
console.log("hmmm")
     // const { testId } = req.params;
     const { testId, result } = req.body;

  try {
 
    if (!result) {
      return res.status(400).json({ message: "New test result is required" });
    }

    const updatedTest = await TestResult.findByIdAndUpdate(
      testId,
      { result },
      { new: true, runValidators: true }
    );

    updatedTest.testId.updatedAt = Date.now();

    if (!updatedTest) {
      return res.status(404).json({ message: "Test result not found" });
    }

    res.status(200).json({ message: "Test result updated!", updatedTest });
  } catch (error) {
    console.error("Error updating test result:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk update lab results
const bulkUpdateLabResults = async (req, res) => {
  const { testIds, result } = req.body;

  try {
    const results = await LabResult.updateMany(
      { _id: { $in: testIds } },
      { $set: { result }, $push: { history: { result, updatedAt: Date.now() } } }
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error bulk updating lab results' });
  }
};

// DELETE: Remove a test result by ID
const deleteMedicalTestResults = async (req, res) => {
  try {
    const { testId } = req.params;
    // console.log("jj", testId)
    // Check if the test exists
    const testResult = await TestResult.findById(testId);
    if (!testResult) {
      return res.status(404).json({ message: "Test result not found" });
    }

    // Delete the test result
    await TestResult.findByIdAndDelete(testId);

    res.json({ message: "Test result deleted successfully" });
  } catch (error) {
    console.error("Error deleting test result:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { AddMedicalTests, 
  GetTestResults, 
  updateMedicalTestResults, 
  deleteMedicalTestResults,
  bulkUpdateLabResults };