const DischargeForm = require('../models/DischargeForm');


// Fetch discharge form for a patient
const getDischargeForm = async (req, res) => {
    try {
       console.log(req.baseUrl.split('/').pop())
      const id = req.params.patientId || req.baseUrl.split('/').pop();
      const dischargeForm = await DischargeForm.findOne({ patientId: id });
      console.log(dischargeForm)
      if (!dischargeForm) return res.status(404).send('Discharge form not found');
      res.json(dischargeForm.forms);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
  
  // Create/update discharge form for a patient
  const createDischargeForm = async (req, res) => {
    const { finalDiagnosis, medicationsOnDischarge, followUpAppointments, dischargeInstructions, doctorNotes } = req.body;
    // console.log(req.body)
    const id = req.params.patientId || req.baseUrl.split('/').pop();
  // console.log('Extracted ID:', id);
  const newForm = req.body;
    try {
      let dischargeForm = await DischargeForm.findOne({ patientId: id });
      console.log("dischargeForm", dischargeForm)
      if (!dischargeForm) {
        dischargeForm = new DischargeForm({ patientId: id, forms: [newForm] });
      } else {
        dischargeForm.forms.push(newForm);
      }
      
      // dischargeForm.finalDiagnosis = finalDiagnosis;
      // dischargeForm.medicationsOnDischarge = medicationsOnDischarge;
      // dischargeForm.followUpAppointments = followUpAppointments;
      // dischargeForm.dischargeInstructions = dischargeInstructions;
      // dischargeForm.doctorNotes = doctorNotes;

      console.log("dischargeForm", dischargeForm)
      
      await dischargeForm.save();
      res.status(200).json(dischargeForm);
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  };

  const editDischargeForms = async (req, res) => {
     const patientId = req.params.patientId || req.baseUrl.split('/').pop();
    try {
      const { formIndex } = req.params;
      const updatedForm = req.body;
      //  console.log('patient', patientId, 'formIn', formIndex, 'updatedForm', updatedForm)
  
      const dischargeRecord = await DischargeForm.findOne({ patientId });
      
      if (!dischargeRecord) return res.status(404).json({ message: "No discharge record found." });
      console.log(dischargeRecord.forms[formIndex])
      if (formIndex >= dischargeRecord.forms.length) {
        return res.status(400).json({ message: "Invalid form index." });
      }
  
      dischargeRecord.forms[formIndex] = { ...dischargeRecord.forms[formIndex], ...updatedForm };
      await dischargeRecord.save();
  
      res.json({ message: "Discharge form updated successfully!", data: dischargeRecord.forms[formIndex] });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  const deleteDischargeForm = async (req, res) => {
    
    try {
      const { formIndex } = req.params;
      const patientId = req.params.patientId || req.baseUrl.split('/').pop();
  console.log(patientId)
      const dischargeRecord = await DischargeForm.findOne({ patientId });
      if (!dischargeRecord) return res.status(404).json({ message: "No discharge record found." });
  console.log(dischargeRecord)
      if (formIndex >= dischargeRecord.forms.length) {
        return res.status(400).json({ message: "Invalid form index." });
      }
  
      dischargeRecord.forms.splice(formIndex, 1);
      await dischargeRecord.save();
  
      res.json({ message: "Discharge form deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  module.exports ={createDischargeForm, getDischargeForm, editDischargeForms, deleteDischargeForm}
  