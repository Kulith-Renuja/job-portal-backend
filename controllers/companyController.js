const User = require('../models/User');
const Job = require('../models/Job');

// GET /api/v1/companies (Admin)
exports.getCompanies = async (req, res) => {
try {
const filter = { role: 'company' };
// Optional server-side status filter (frontend currently filters client-side)
if (req.query.status && ['pending','approved','rejected'].includes(req.query.status)) {
filter.companyStatus = req.query.status;
}
const companies = await User.find(filter)
  .select('-password') // avoid leaking password
  .sort({ createdAt: -1 });

res.json(companies);
} catch (err) {
res.status(500).json({ message: 'Failed to fetch companies', error: err.message });
}
};

// GET /api/v1/companies/:id (Admin)
exports.getCompanyById = async (req, res) => {
try {
const company = await User.findOne({ _id: req.params.id, role: 'company' })
.select('-password');
if (!company) return res.status(404).json({ message: 'Company not found' });
res.json(company);
} catch (err) {
res.status(500).json({ message: 'Failed to fetch company', error: err.message });
}
};

// PUT /api/v1/companies/:id (Admin) body: { companyStatus }
exports.updateCompanyStatus = async (req, res) => {
try {
const { companyStatus } = req.body;
if (!['approved', 'rejected', 'pending'].includes(companyStatus)) {
return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending.' });
}

const update = { companyStatus };
// On approval, reset posting quota
if (companyStatus === 'approved') {
  update.freePostsRemaining = 3;
  update.lastFreePostReset = new Date();
}

const updatedUser = await User.findOneAndUpdate(
  { _id: req.params.id, role: 'company' },
  update,
  { new: true, runValidators: true }
).select('-password');

if (!updatedUser) return res.status(404).json({ message: 'Company not found' });

res.json({
  message: `Company status updated to ${updatedUser.companyStatus}`,
  company: updatedUser
});

} catch (err) {
res.status(500).json({ message: 'Failed to update company status', error: err.message });
}
};

// GET /api/v1/companies/:id/jobs (Owner/Admin)
// GET /api/v1/companies/:id/jobs (Owner/Admin)
exports.getCompanyJobs = async (req, res) => {
try {
// Check the company exists; we already guard owner/admin in routes
const jobs = await Job.find({ companyId: req.params.id }).sort({ createdAt: -1 });
res.json(jobs);
} catch (err) {
res.status(500).json({ message: 'Failed to fetch company jobs', error: err.message });
}
};

// GET /api/v1/companies/:id/can-post (Owner/Admin)
exports.canPostJob = async (req, res) => {
try {
const company = await User.findOne({ _id: req.params.id, role: 'company' });
if (!company) return res.status(404).json({ message: 'Company not found' });
if (company.companyStatus !== 'approved') {
  return res.status(403).json({ canPost: false, freePostsRemaining: company.freePostsRemaining, message: 'Company not approved to post jobs' });
}

// Monthly reset logic
const now = new Date();
const last = new Date(company.lastFreePostReset || now);
if (last.getFullYear() !== now.getFullYear() || last.getMonth() !== now.getMonth()) {
  company.freePostsRemaining = 3;
  company.lastFreePostReset = now;
  await company.save();
}

const canPost = company.freePostsRemaining > 0;
return res.json({
  canPost,
  freePostsRemaining: company.freePostsRemaining,
  message: canPost ? 'You can post a job' : 'No free posts remaining this month'
});
} catch (err) {
res.status(500).json({ message: 'Failed to check posting eligibility', error: err.message });
}
};