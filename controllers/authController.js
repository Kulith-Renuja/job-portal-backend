const User = require('../models/User');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if phone already exists
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const user = await User.create({ name, email, phone, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Register new company
// @route   POST /api/v1/auth/register-company
// @access  Public
exports.registerCompany = async (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    password,
    companyName,
    registrationNumber,
    address,
    contactPerson,
    contactPhone,
    contactEmail,
    website,
    industry,
    companySize,
    description
  } = req.body;

  try {
    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if registration number already exists
    const existingReg = await Company.findOne({ registrationNumber });
    if (existingReg) {
      return res.status(400).json({ message: 'Company registration number already registered' });
    }

    // Create user first with company role
    const user = await User.create({ 
      name, 
      email: contactEmail, 
      phone: contactPhone, 
      password,
      role: 'company',
      companyName,
      registrationNumber,
      address,
      contactPerson,
      website,
      industry,
      companySize,
      description
    });

    // Create company record
    const company = await Company.create({
      user: user._id,
      companyName,
      registrationNumber,
      address,
      contactPerson,
      contactPhone,
      contactEmail,
      website,
      industry,
      companySize,
      description
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyStatus: user.companyStatus,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Login user (by phone & password)
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};
