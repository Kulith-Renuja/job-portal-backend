const Migration = require('../models/Migration');

// GET all
exports.getMigrations = async (req, res) => {
  try {
    const migrations = await Migration.find().sort({ createdAt: -1 });
    res.json(migrations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch migrations', error: err.message });
  }
};

// CREATE
exports.createMigration = async (req, res) => {
  try {
    const { title, image, subtitles } = req.body;
    const migration = await Migration.create({ title, image, subtitles });
    res.status(201).json(migration);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create migration', error: err.message });
  }
};

// UPDATE
exports.updateMigration = async (req, res) => {
  try {
    const updated = await Migration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Migration not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE
exports.deleteMigration = async (req, res) => {
  try {
    const deleted = await Migration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Migration not found' });
    res.json({ message: 'Migration deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
