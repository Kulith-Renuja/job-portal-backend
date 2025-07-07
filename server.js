const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const courseRoutes = require('./routes/courseRoutes');
const migrationRoutes = require('./routes/migrationRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/migrations', migrationRoutes);