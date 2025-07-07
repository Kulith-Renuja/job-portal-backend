const Country = require('../models/Country');

// GET all
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch countries', error: err.message });
  }
};

// CREATE
exports.createCountry = async (req, res) => {
  try {
    const { title, image, subtitles } = req.body;
    const country = await Country.create({ title, image, subtitles });
    res.status(201).json(country);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create country', error: err.message });
  }
};

// UPDATE
exports.updateCountry = async (req, res) => {
  try {
    const updated = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Country not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE
exports.deleteCountry = async (req, res) => {
  try {
    const deleted = await Country.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Country not found' });
    res.json({ message: 'Country deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
