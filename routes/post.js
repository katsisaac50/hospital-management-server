// Add a new patient
// app.post('/api/patients', async (req, res) => {
//   const { name, age, contact, medicalHistory } = req.body;
//   try {
//       const newPatient = new Patient({ name, age, contact, medicalHistory });
//       await newPatient.save();
//       res.status(201).json(newPatient);
//   } catch (err) {
//       res.status(400).json({ message: 'Error adding patient', error: err });
//   }
// });