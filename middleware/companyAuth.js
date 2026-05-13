const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

exports.protectCompany = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'company') {
        return res.status(403).json({ message: 'Access denied — not a company token', decoded });
      }

      req.company = await Company.findById(decoded.id).select('-password');
      if (!req.company) {
        return res.status(401).json({ message: 'Company not found' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};
