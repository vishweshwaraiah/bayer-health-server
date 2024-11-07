const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/booking', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Booking microservice running on http://localhost:${PORT}`);
});
