const User = require('../models/User');
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
      status: user.status,
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
    email, // optional account email (not unique)
    phone, // REQUIRED: login phone (unique)
    password, // REQUIRED
    companyName, // REQUIRED
    registrationNumber, // REQUIRED (not unique by your rule)
    address, // REQUIRED
    contactPerson, // REQUIRED
    contactPhone, // optional company landline
    contactEmail, // optional company contact email
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

    // Create user first with company role
    // Notes:
    // - phone is the login phone
    // - contactPhone/contactEmail are company contacts (optional)
    // - freePostsRemaining and lastFreePostReset require fields in your User schema
    const user = await User.create({ 
      name :name || contactPerson || companyName, // fallback to any available name
      email: email || '',               // account email (optional, not unique)
      phone, // login phone (unique)
      password,
      role: 'company',
      companyStatus: 'pending',
      companyName,
      registrationNumber,
      address,
      contactPerson,
      contactPhone: contactPhone || '',
      contactEmail,
      website,
      industry,
      companySize,
      description,
      freePostsRemaining: 3,
      lastFreePostReset: new Date()
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyStatus: user.companyStatus,
      companyId: user._id,            // since you use a single model
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
      companyStatus: user.companyStatus,           // defined for company accounts
      companyId: user.role === 'company' ? user._id : null, // single-model: companyId is user._id
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};
