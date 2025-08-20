const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Admin
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('user', 'name email phone');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch companies', error: err.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/v1/companies/:id
// @access  Admin
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('user', 'name email phone');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company', error: err.message });
  }
};

// @desc    Update company status (approve/reject)
// @route   PUT /api/v1/companies/:id
// @access  Admin
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
    }
    
    // Find company
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Update company status
    company.status = status;
    await company.save();
    
    // Update user's companyStatus
    const user = await User.findById(company.user);
    if (user) {
      user.companyStatus = status;
      await user.save();
    }
    
    res.json({ 
      message: `Company ${status} successfully`,
      company 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update company status', error: err.message });
  }
};

// @desc    Get company jobs (for company dashboard)
// @route   GET /api/v1/companies/:id/jobs
// @access  Company
exports.getCompanyJobs = async (req, res) => {
  try {
    // This will be implemented when we add job functionality
    res.json({ message: 'Company jobs endpoint - to be implemented' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company jobs', error: err.message });
  }
};

// @desc    Check if company can post job (free posts remaining)
// @route   GET /api/v1/companies/:id/can-post
// @access  Company
exports.canPostJob = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if company is approved
    if (company.status !== 'approved') {
      return res.status(403).json({ message: 'Company not approved to post jobs' });
    }
    
    // Check free posts
    const canPost = company.freePostsRemaining > 0;
    
    res.json({ 
      canPost,
      freePostsRemaining: company.freePostsRemaining,
      message: canPost 
        ? `You have ${company.freePostsRemaining} free posts remaining` 
        : 'You have used all your free posts'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check posting eligibility', error: err.message });
  }
};