const Job = require('../models/Job');
const User = require('../models/User');

// GET /api/v1/jobs (public)
exports.getJobs = async (req, res) => {
try {
const jobs = await Job.find().sort({ createdAt: -1 });
res.json(jobs);
} catch (err) {
res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
}
};

// POST /api/v1/jobs (protected; admin or company)
exports.createJob = async (req, res) => {
try {
const {
title, place, category, content, image, salary, jobType, deadline,
requiredEducationLevel, requiredFieldOfStudy, minGraduationYear,
applicationEmail, companyName // from admin form
} = req.body;
const user = req.user;

if (!['admin', 'company'].includes(user.role)) {
  return res.status(403).json({ message: 'Only companies and admins can post jobs' });
}

// Admin flow: can post without registered company
if (user.role === 'admin') {
  const cid = req.body.companyId || user._id; // per your requirement: use admin id
  const cName = companyName || req.body.company || 'Admin';

  const job = await Job.create({
    title,
    place,
    category,
    content,
    image,
    salary,
    jobType,
    deadline,
    requiredEducationLevel,
    requiredFieldOfStudy,
    minGraduationYear,
    applicationEmail: applicationEmail || '',

    companyId: cid,
    companyName: cName
  });

  return res.status(201).json(job);
}

// Company flow: must be approved; monthly reset and quota
if (user.role === 'company') {
  if (user.companyStatus !== 'approved') {
    return res.status(403).json({ message: 'Company not approved to post jobs' });
  }

  // Monthly reset
  const now = new Date();
  const last = new Date(user.lastFreePostReset || now);
  if (last.getFullYear() !== now.getFullYear() || last.getMonth() !== now.getMonth()) {
    user.freePostsRemaining = 3;
    user.lastFreePostReset = now;
  }

  if (user.freePostsRemaining <= 0) {
    await user.save(); // persist any reset above
    return res.status(403).json({ message: 'No free posts remaining this month' });
  }

  const cName = user.companyName || user.name;

  const job = await Job.create({
    title,
    place,
    category,
    content,
    image,
    salary,
    jobType,
    deadline,
    requiredEducationLevel,
    requiredFieldOfStudy,
    minGraduationYear,
    applicationEmail: applicationEmail || user.contactEmail || user.email || '',

    companyId: user._id,
    companyName: cName
  });

  user.freePostsRemaining -= 1;
  await user.save();

  return res.status(201).json(job);
}

return res.status(400).json({ message: 'Invalid role' });
} catch (err) {
res.status(500).json({ message: 'Failed to create job', error: err.message });
}
};

// PUT /api/v1/jobs/:id (protected; owner or admin)
exports.updateJob = async (req, res) => {
try {
const job = await Job.findById(req.params.id);
if (!job) return res.status(404).json({ message: 'Job not found' });
const isOwner = job.companyId && job.companyId.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) {
  return res.status(403).json({ message: 'Not authorized to update this job' });
}

const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
} catch (err) {
res.status(500).json({ message: 'Update failed', error: err.message });
}
};

// DELETE /api/v1/jobs/:id (protected; owner or admin)
exports.deleteJob = async (req, res) => {
try {
const job = await Job.findById(req.params.id);
if (!job) return res.status(404).json({ message: 'Job not found' });
const isOwner = job.companyId && job.companyId.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) {
  return res.status(403).json({ message: 'Not authorized to delete this job' });
}

await Job.findByIdAndDelete(req.params.id);
res.json({ message: 'Job deleted' });
} catch (err) {
res.status(500).json({ message: 'Delete failed', error: err.message });
}
};