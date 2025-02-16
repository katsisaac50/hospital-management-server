const IdCounter = require('../models/idCounter');

const getNextPatientId = async () => {
    const counter = await IdCounter.findOneAndUpdate(
      { collectionName: 'patients' },
      { $inc: { counter: 1 } },
      { new: true, upsert: true }
    );
    return counter.counter;
  };

  module.exports ={getNextPatientId}
  