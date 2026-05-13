const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Register new company
// @route   POST /api/v1/company/register
// @access  Public
exports.registerCompany = async (req, res) => {
  const {
    email, password, name, telephone, country, address,
    industry, companySize, brNumber,
    contactPerson
  } = req.body;

  try {
    // Check if email already exists
    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const company = await Company.create({
      email,
      password,
      name,
      telephone,
      country,
      address,
      industry,
      companySize,
      brNumber,
      contactPerson
    });

    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      industry: company.industry,
      role: 'company',
      token: generateToken(company, 'company'),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Login company (email & password)
// @route   POST /api/v1/company/login
// @access  Public
exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company || !(await company.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      industry: company.industry,
      role: 'company',
      token: generateToken(company, 'company'),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// @desc    Get company profile
// @route   GET /api/v1/company/profile
// @access  Private (Company)
exports.getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company.id).select('-password');
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// @desc    Update company profile
// @route   PUT /api/v1/company/profile
// @access  Private (Company)
exports.updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update fields
    Object.assign(company, req.body);
    await company.save();

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      industry: company.industry,
      role: 'company',
      token: generateToken(company, 'company'),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
