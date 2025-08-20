const Job = require('../models/Job');
const User = require('../models/User');
const Course = require('../models/Course');
const Migration = require('../models/Migration');
const Story = require('../models/Story');
const Country = require('../models/Country');
const Company = require('../models/Company');

exports.getDashboardStats = async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const migrations = await Migration.countDocuments();
    const stories = await Story.countDocuments();
    const countries = await Country.countDocuments();
    const companies = await Company.countDocuments();

    res.json({ jobs, users, courses, migrations, stories, countries, companies });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// @desc    Get all companies for admin
// @route   GET /api/v1/dashboard/companies
// @access  Private/Admin
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('user', 'name email phone');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch companies', error: err.message });
  }
};

// @desc    Update company status
// @route   PUT /api/v1/dashboard/companies/:id
// @access  Private/Admin
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
