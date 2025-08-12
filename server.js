const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const courseRoutes = require('./routes/courseRoutes');
const migrationRoutes = require('./routes/migrationRoutes');
const storyRoutes = require('./routes/storyRoutes');
const countryRoutes = require('./routes/countryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const usermanageRoutes = require('./routes/usermanageRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin:  'http://localhost:3000',
}));

app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/migrations', migrationRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/countries', countryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/dashboard', require('./routes/adminRoutes'));
app.use('/api/v1/usermanage', usermanageRoutes);

// Test route (keep last)
app.get('/', (req, res) => {
  res.send('API is running...');
});