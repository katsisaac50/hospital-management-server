const doctorNotes=async (req, res) => {
    try {
      const note = new DoctorNote(req.body);
      await note.save();
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  module.exports ={doctorNotes}