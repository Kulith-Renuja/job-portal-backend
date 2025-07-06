const express = require('express');
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(createJob); // Later: add authMiddleware

router.route('/:id')
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
