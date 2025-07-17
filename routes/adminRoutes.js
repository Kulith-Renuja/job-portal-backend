const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/v1/dashboard/stats
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;