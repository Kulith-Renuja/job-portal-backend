const express = require('express');
const {
  registerCompany,
  loginCompany,
  getCompanyProfile,
  updateCompanyProfile
} = require('../controllers/companyController');

const { protectCompany } = require('../middleware/companyAuth');

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.get('/profile', protectCompany, getCompanyProfile);
router.put('/profile', protectCompany, updateCompanyProfile);

module.exports = router;
