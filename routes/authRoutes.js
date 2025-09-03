const express = require('express');
const { getMe,registerUser, loginUser, registerCompany } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-company', registerCompany);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
