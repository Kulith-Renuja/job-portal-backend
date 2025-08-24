const User = require('../models/User'); // We now only need the User model
const mongoose = require('mongoose'); // This is not strictly necessary but can be kept for consistency

// @desc    Get all companies
// @route   GET /api/v1/companies
// @access  Admin
exports.getCompanies = async (req, res) => {
    try {
        // Find all users where the role is 'company'
        const companies = await User.find({ role: 'company' });
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
        // Find a user with the specified ID and a role of 'company'
        const company = await User.findOne({ _id: req.params.id, role: 'company' });

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
        const { companyStatus } = req.body;
        
        // Validate status
        if (!['approved', 'rejected', 'pending'].includes(companyStatus)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
        }
        
        // Find and update a user with the specified ID and a 'company' role
        // This is much simpler than updating two separate documents
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'company' }, 
            { companyStatus },
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        res.json({ 
            message: `Company status updated to ${updatedUser.companyStatus}`,
            company: updatedUser
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
        // Since we're using a single user model, we can check the companyStatus and other details on the user
        const user = req.user;
        if (!user || user.role !== 'company') {
            return res.status(403).json({ message: 'You are not authorized to perform this action' });
        }
        
        // Check if company is approved
        if (user.companyStatus !== 'approved') {
            return res.status(403).json({ canPost: false, message: 'Your company is not approved to post jobs' });
        }
        
        // You would also check `freePostsRemaining` here, if you add that field to the User model
        const canPost = true; // Placeholder for now
        
        res.json({ 
            canPost,
            message: canPost 
                ? 'You can post a job' 
                : 'You are not eligible to post at this time'
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to check posting eligibility', error: err.message });
    }
};
