const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();


const app = express();
app.use(cors());
connectDB();

app.use(express.json());
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`User microservice running on http://localhost:${PORT}`);
});
