const mongoose = require("mongoose");
const TestResult = require("../models/medicalTestResults");

const updateTestStatus = async (req, res) => {
    try {
      const { testId } = req.params;
      const { testStatus } = req.body;
  
      const updatedTest = await TestResult.findByIdAndUpdate(
        testId,
        { testStatus },
        { new: true }
      );
  
      if (!updatedTest) {
        return res.status(404).send('Test not found');
      }
  
      res.json(updatedTest);
    } catch (error) {
      res.status(500).send('Error updating test status');
    }
  };

  module.exports = { updateTestStatus };