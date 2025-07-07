const express = require('express');
const {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry
} = require('../controllers/countryController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCountries)
  .post(protect, admin, createCountry);

router.route('/:id')
  .put(protect, admin, updateCountry)
  .delete(protect, admin, deleteCountry);

module.exports = router;
