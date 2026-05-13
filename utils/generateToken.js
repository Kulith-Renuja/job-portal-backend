const jwt = require('jsonwebtoken');

const generateToken = (entity, type = 'user') => {
  return jwt.sign(
    {
      id: entity._id,
      role: type, // "user" | "company" | "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
