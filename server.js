const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const allowedOrigins = [
    'http://localhost:3000', 
    'https://hospital-management-client-kappa.vercel.app' // ✅ Add your deployed frontend URL
  ];

const app = express();
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // ✅ Allow credentials (cookies, authorization headers, etc.)
  }));

app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));
app.use('/api/invoices', require('./routes/invoicesRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
