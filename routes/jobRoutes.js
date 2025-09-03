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

// ⭐ This route now handles both companies and admins for creation
router.route('/').post(protect, createJob);

// ⭐ These routes now allow both the job owner (company) and an admin to update/delete
router.route('/:id')
    .put(protect, updateJob)
    .delete(protect, deleteJob);

module.exports = router;