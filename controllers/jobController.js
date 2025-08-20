const Job = require('../models/Job');
const Company = require('../models/Company');

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
// @access  Private/Company
exports.createJob = async (req, res) => {
  const { title, place, company, category, content, image,
    requiredEducationLevel, requiredFieldOfStudy, minGraduationYear } = req.body;

  try {
    // Check if user is a company
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: 'Only companies can post jobs' });
    }

    // Check if company is approved
    const companyRecord = await Company.findOne({ user: req.user._id });
    if (!companyRecord || companyRecord.status !== 'approved') {
      return res.status(403).json({ message: 'Company not approved to post jobs' });
    }

    // Check if company can post (free posts remaining)
    if (companyRecord.freePostsRemaining <= 0) {
      return res.status(403).json({ message: 'No free posts remaining' });
    }

    // Create job
    const job = await Job.create({
      title,
      place,
      company: companyRecord.companyName,
      category,
      content,
      image,
      requiredEducationLevel,
      requiredFieldOfStudy,
      minGraduationYear
    });

    // Decrement free posts count
    companyRecord.freePostsRemaining -= 1;
    await companyRecord.save();

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
