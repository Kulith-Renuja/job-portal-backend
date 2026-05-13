const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const jobRoutes = require('./routes/jobRoutes');
const courseRoutes = require('./routes/courseRoutes');
const migrationRoutes = require('./routes/migrationRoutes');
const storyRoutes = require('./routes/storyRoutes');
const countryRoutes = require('./routes/countryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const usermanageRoutes = require('./routes/usermanageRoutes');
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load env & DB connect
dotenv.config();
connectDB();

const app = express();

// Middleware
/*
app.use(cors({
     origin:  'http://localhost:3000',
}));
*/
app.use(cors({
   origin: process.env.FRONTEND_URL ,
   }));



app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/migrations', migrationRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/countries', countryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/dashboard', adminRoutes);
app.use('/api/v1/usermanage', usermanageRoutes);
app.use("/api/v1/company", companyRoutes);

// Test route (keep last)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server (always last)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
