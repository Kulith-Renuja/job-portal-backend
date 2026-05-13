const express = require('express');
const router = express.Router();
const {
  getJobs,
  getCompanyJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');
const { protectUniversal } = require('../middleware/universalProtect');
const { protectCompany } = require('../middleware/companyAuth');

// Public route
router.get('/', getJobs);

// Company-only jobs (Company or Admin)
router.get('/company/:companyId', protectUniversal, getCompanyJobs);

// Create job (company or admin)
router.post('/', protectUniversal , createJob);

// Update job (Admin only)
router.put('/:id', protect, updateJob);

// Delete job (Company or Admin)
router.delete('/:id', protectUniversal, deleteJob);

module.exports = router;
