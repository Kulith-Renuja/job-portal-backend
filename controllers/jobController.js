const Job = require('../models/Job');
const User = require('../models/User'); 

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
// @access  Private/Company & Admin
exports.createJob = async (req, res) => {
    const { _id: companyId, companyName, role, status, freePostsRemaining } = req.user;
    const { title, place, category, content, image,
        requiredEducationLevel, requiredFieldOfStudy, minGraduationYear } = req.body;

    try {
        // ⭐ UPDATED LOGIC: Allow both 'company' and 'admin' roles to create a job.
        if (!['company', 'admin'].includes(role)) {
            return res.status(403).json({ message: 'Only companies and admins can post jobs' });
        }

        // Check if company is approved (only applicable to company roles)
        if (role === 'company' && status !== 'approved') {
            return res.status(403).json({ message: 'Company not approved to post jobs' });
        }
        
        // Check if company can post (free posts remaining)
        if (role === 'company' && freePostsRemaining <= 0) {
            return res.status(403).json({ message: 'No free posts remaining' });
        }

        const job = await Job.create({
            title,
            place,
            companyId,
            companyName,
            category,
            content,
            image,
            requiredEducationLevel,
            requiredFieldOfStudy,
            minGraduationYear
        });

        // Decrement free posts count for companies
        if (role === 'company') {
            req.user.freePostsRemaining -= 1;
            await req.user.save();
        }

        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create job', error: err.message });
    }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private/Admin & Private/Company
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private/Admin & Private/Company
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        const deleted = await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};
