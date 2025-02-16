const Test = require('../models/medicalTests');

  const defaultTests = [
    { testName: 'Blood Pressure', referenceValue: '120/80 mmHg', unit: 'mmHg', category: 'Cardiology' },
    { testName: 'Glucose Level', referenceValue: '70-100 mg/dL', unit: 'mg/dL', category: 'Endocrinology' },
    { testName: 'Cholesterol', referenceValue: 'Below 200 mg/dL', unit: 'mg/dL', category: 'Cardiology' },
    { testName: 'Hemoglobin', referenceValue: '13-17 g/dL', unit: 'g/dL', category: 'Hematology' },
  ];
  
  const insertDefaultTests = async () => {
    try {
  
      // Check if tests are already in the database
      const existingTests = await Test.find();
      if (existingTests.length === 0) {
        // Insert the default tests if no tests exist
        await Test.insertMany(defaultTests);
        console.log('Default tests inserted successfully!');
      } else {
        console.log('Tests already exist in the database.');
      }
    } catch (error) {
      console.error('Error inserting default tests:', error);
    } finally {
      // Close the database connection
      mongoose.connection.close();
    }
  };

  const getAllMedicalTests = async (req, res) => {
    console.log('hello')
    try {
      const tests = await Test.find();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tests', error });
    }
  }

  module.exports ={getAllMedicalTests, insertDefaultTests}