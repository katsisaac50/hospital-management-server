app.post("/api/sync", async (req, res) => {
    try {
      await YourModel.insertMany(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  import express from 'express';
import RecordModel from '../models/RecordModel';

const router = express.Router();

router.post('/sync', async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    await RecordModel.insertMany(records);
    res.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
