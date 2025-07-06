const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
  const { title, place, company, category, content, image } = req.body;

  try {
    const job = await Job.create({ title, place, company, category, content, image });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Job not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
