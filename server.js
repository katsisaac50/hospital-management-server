const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Dynamic CORS setup
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://hospital-management-client-kappa.vercel.app",
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// API Routes
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/reports", require("./routes/reportsRoutes"));
app.use("/api/invoices", require("./routes/invoicesRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/medicaltests", require("./routes/medicalTestRoutes"));
app.use("/api/medicalTestResults", require("./routes/medicalTestResultsRoutes"));
app.use("/api/lab-test-request", require("./routes/labTestRequestRoutes"));
app.use("/api/activityLogs", require("./routes/activityLogRoutes"));
app.use("/api/update-status", require("./routes/updateStatusRoutes"));
app.use("/api/discharge/:patientId", require("./routes/dischargeFormRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
