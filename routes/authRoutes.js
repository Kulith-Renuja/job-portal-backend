const express = require('express');
const { registerUser, loginUser, registerCompany } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-company', registerCompany);
router.post('/login', loginUser);

module.exports = router;
