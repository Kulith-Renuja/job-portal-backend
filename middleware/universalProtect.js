const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

exports.protectUniversal = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user in User collection (admin or normal user)
      let user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }

      // If not found, try Company collection
      let company = await Company.findById(decoded.id).select('-password');
      if (company) {
        // make it consistent with req.user for controller logic
        req.user = {
          _id: company._id,
          role: 'company',
          email: company.email,
          name: company.name,
        };
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, account not found' });
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
