const express = require('express');
const {
  getCompanies,
  getCompanyById,
  updateCompanyStatus,
  getCompanyJobs,
  canPostJob
} = require('../controllers/companyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, admin, getCompanies);

router.route('/:id')
  .get(protect, admin, getCompanyById)
  .put(protect, admin, updateCompanyStatus);

// Company routes
router.route('/:id/jobs')
  .get(protect, getCompanyJobs);

router.route('/:id/can-post')
  .get(protect, canPostJob);

module.exports = router;