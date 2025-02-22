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
      .populate("testName", "testName referenceValue unit category") // Join test details
      .sort({ createdAt: -1 }); // Sort newest first
// console.log("testResults", testResults)
    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ message: "Error fetching test results", error });
  }
};

const updateMedicalTestResults = async (req, res) => {
  console.log('Authenticated user:', req.user);
  console.log('testing', req.body, 'params', req.params)

     const { id } = req.params;
      const { result, testStatus} = req.body;

     try {
      if (req.user.role !== "labTechnician") {
        return res.status(403).json({ error: "Access Denied" });
      }
  
      
  
      const test = await TestResult.findById(id);
      if (!test) return res.status(404).json({ error: "Test not found" });
  
      if (test.testStatus === "completed" && testStatus !== "completed") {
        return res.status(400).json({ error: "Completed tests cannot be modified" });
      }
  console.log('test', test, result, testStatus);
  
      test.result = result;
      test.testStatus = testStatus || test.testStatus;
      await test.save();
  
      res.json({ message: "Test updated successfully", test });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
};

// Create lab Request 

const labTestRequest = async (req, res) => {
  console.log('team work', req.body)
  const { patientId, doctorId, testName, testNotes, diagnosisHypothesis, sampleType, sampleCollectionDate } = req.body;

  // Validation
  if (!patientId || !doctorId || !testName) {
    return res.status(400).json({ message: "Patient ID, Doctor ID, and Test Name are required" });
  }

  try {
    // Create a new TestResult document with the form data
    const newTestResult = new TestResult({
      patientId,
      doctorId,
      testName,
      testStatus: "requested", // Default status is 'requested'
      sampleType,
      sampleCollectionDate,
      testNotes,
      diagnosisHypothesis,
    });

    // Save the test request to the database
    await newTestResult.save();

    // Respond with success message and the created test result
    return res.status(201).json({ message: "Lab test request submitted successfully", data: newTestResult });
  } catch (error) {
    console.error("Error submitting lab test request:", error);
    return res.status(500).json({ message: "Server error, could not process the request" });
  }
};

// Bulk update lab results
const bulkUpdateLabResults = async (req, res) => {
  const { testIds, result } = req.body;

  try {
    const results = await TestResult.updateMany(
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
  bulkUpdateLabResults, labTestRequest };