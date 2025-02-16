const ActivityLog = require("../models/ActivityLog.js");

const getactivityLogs = async (req, res) => {
    try {
      const activityLogs = await ActivityLog.find();
      res.json(activityLogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const createActivityLog = async (req, res) => {
    const { action, user } = req.body;
    try {
      const newLog = new ActivityLog({ action, user });
      await newLog.save();
      res.status(201).json({ message: "Activity logged successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  getactivityLogs,
  createActivityLog,
};