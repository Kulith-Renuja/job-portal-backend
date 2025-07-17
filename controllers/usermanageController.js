const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/usermanage
// @access  Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Update user status (deactivate or flag)
// @route   PUT /api/v1/usermanage/:id
// @access  Admin only
exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
};
