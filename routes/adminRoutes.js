const express = require('express');
const { getDashboardStats, getCompanies, updateCompanyStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/v1/dashboard/stats
router.get('/stats', protect, admin, getDashboardStats);

// Company management routes
router.route('/companies')
  .get(protect, admin, getCompanies);

router.route('/companies/:id')
  .put(protect, admin, updateCompanyStatus);

module.exports = router;