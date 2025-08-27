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

// Simple owner-or-admin guard
const ownerOrAdmin = (req, res, next) => {
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
if (req.user.role === 'admin') return next();
if (req.user._id.toString() === req.params.id) return next();
return res.status(403).json({ message: 'Not authorized' });
};

// Admin routes
router.route('/')
.get(protect, admin, getCompanies);

router.route('/:id')
.get(protect, admin, getCompanyById)
.put(protect, admin, updateCompanyStatus);

// Company-owned routes
router.route('/:id/jobs')
.get(protect, ownerOrAdmin, getCompanyJobs);

router.route('/:id/can-post')
.get(protect, ownerOrAdmin, canPostJob);

module.exports = router;