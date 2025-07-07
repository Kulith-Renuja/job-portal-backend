const express = require('express');
const {
  getStories,
  createStory,
  updateStory,
  deleteStory
} = require('../controllers/storyController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getStories)
  .post(protect, admin, createStory);

router.route('/:id')
  .put(protect, admin, updateStory)
  .delete(protect, admin, deleteStory);

module.exports = router;
