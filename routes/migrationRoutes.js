const express = require('express');
const {
  getMigrations,
  createMigration,
  updateMigration,
  deleteMigration
} = require('../controllers/migrationController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getMigrations)
  .post(protect, admin, createMigration);

router.route('/:id')
  .put(protect, admin, updateMigration)
  .delete(protect, admin, deleteMigration);

module.exports = router;
