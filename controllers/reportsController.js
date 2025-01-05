const Patient = require('../models/Patient');
const User = require('../models/User');
// Assuming Invoice model exists
const Invoice = require('../models/Invoice');

/**
 * Get overall statistics for the hospital.
 */
const getStatistics = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalRevenue = await Invoice.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]).then((result) => (result[0]?.totalAmount || 0));

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics.',
      error: error.message,
    });
  }
};

/**
 * Get reports for a specific doctor by their ID.
 */
const getDoctorReports = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Find patients linked to the doctor
    const patients = await Patient.find({ doctor: doctorId });

    if (!patients.length) {
      return res.status(404).json({
        success: false,
        message: 'No patients found for this doctor.',
      });
    }

    const totalPatients = patients.length;

    res.status(200).json({
      success: true,
      data: {
        doctorId,
        totalPatients,
        patients,
      },
    });
  } catch (error) {
    console.error('Error fetching doctor reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor reports.',
      error: error.message,
    });
  }
};

/**
 * Get financial reports, summarizing revenue and transactions.
 */
const getFinanceReports = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // Build query for date range filtering
    const filter = {};
    if (dateFrom) filter.date = { $gte: new Date(dateFrom) };
    if (dateTo) filter.date = { ...(filter.date || {}), $lte: new Date(dateTo) };

    const transactions = await Invoice.find(filter);
    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalTransactions: transactions.length,
        totalRevenue,
        transactions,
      },
    });
  } catch (error) {
    console.error('Error fetching financial reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial reports.',
      error: error.message,
    });
  }
};

/**
 * Get detailed reports for a specific patient by their ID.
 */
const getPatientReports = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Error fetching patient report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient report.',
      error: error.message,
    });
  }
};

module.exports = {
  getStatistics,
  getDoctorReports,
  getFinanceReports,
  getPatientReports,
};
