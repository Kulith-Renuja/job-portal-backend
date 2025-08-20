const express = require('express');
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public
router.route('/').get(getJobs);

// Admin and Company routes
router.route('/')
  .post(protect, createJob);

router.route('/:id')
  .put(protect, admin, updateJob)
  .delete(protect, admin, deleteJob);

module.exports = router;
