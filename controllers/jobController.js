const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId', 'name email');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// @desc    Get jobs of a specific company
// @route   GET /api/v1/jobs/company/:companyId
// @access  Private (Company)
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company jobs', error: err.message });
  }
};

// @desc    Create a new job
// @route   POST /api/v1/jobs
// @access  Private (Company or Admin)
// Create Job (Company or Admin)
exports.createJob = async (req, res) => {
  try {
    const {
      title, // ✅ changed from jobTitle
      category, // ✅ changed from jobCategory
      jobType,
      description,
      location,
      salary,
      educationLevel,
      qualificationLevel,
      rolesAndResponsibilities,
      languages,
      deadline,
      email,
      imageUrl,
      companyId // only for admin
    } = req.body;

    // check logged user role
    const userRole = req.user?.role;
    let assignedCompanyId;

    if (userRole === 'company') {
      assignedCompanyId = req.user._id;
    } else if (userRole === 'admin') {
      if (!companyId)
        return res.status(400).json({ message: 'companyId is required for admin job creation' });
      assignedCompanyId = companyId;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    // find company details
    const company = await Company.findById(assignedCompanyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const contactEmail = email || company.email;

    const finalDeadline = deadline
      ? new Date(deadline)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newJob = new Job({
      companyId: assignedCompanyId, // ✅ match model
      title, // ✅ match model
      category, // ✅ match model
      jobType,
      description,
      location,
      salary,
      educationLevel,
      qualificationLevel,
      rolesAndResponsibilities,
      languages,
      deadline: finalDeadline,
      email: contactEmail,
      imageUrl
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Update job (Admin only)
// @route   PUT /api/v1/jobs/:id
// @access  Private (Admin)
exports.updateJob = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Company or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (req.user.role !== 'admin' && job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
