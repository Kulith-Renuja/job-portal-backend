const Job = require('../models/Job');
const User = require('../models/User');
const Course = require('../models/Course');
const Migration = require('../models/Migration');
const Story = require('../models/Story');
const Country = require('../models/Country');


exports.getDashboardStats = async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const migrations = await Migration.countDocuments();
    const stories = await Story.countDocuments();
    const countries = await Country.countDocuments();

    res.json({ jobs, users, courses, migrations, stories, countries });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
