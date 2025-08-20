const express = require('express');
const multer = require('multer');
const {
  submitApplication,
  getJobApplications,
  getFilteredApplications
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Submit job application
router.route('/')
  .post(upload.single('cv'), submitApplication);

// Get applications for a job
router.route('/job/:jobId')
  .get(protect, getJobApplications);

// Get filtered applications for a company
router.route('/company/:companyId/filtered')
  .get(protect, getFilteredApplications);

module.exports = router;