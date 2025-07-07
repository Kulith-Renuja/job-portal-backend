const Story = require('../models/Story');

// GET /api/v1/stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stories', error: err.message });
  }
};

// POST /api/v1/stories
exports.createStory = async (req, res) => {
  try {
    const { title, image, content } = req.body;
    const story = await Story.create({ title, image, content });
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create story', error: err.message });
  }
};

// PUT /api/v1/stories/:id
exports.updateStory = async (req, res) => {
  try {
    const updated = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Story not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/v1/stories/:id
exports.deleteStory = async (req, res) => {
  try {
    const deleted = await Story.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Story not found' });
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
