const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
} = require('../controllers/usermanageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Only admins can access user management
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUserStatus);

module.exports = router;
