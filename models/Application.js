const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Applicant information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  // Education details
  education: {
    level: {
      type: String,
      enum: ['high-school', 'diploma', 'bachelor', 'master', 'doctorate'],
      required: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true
    },
    graduationYear: {
      type: Number,
      required: true
    }
  },
  experience: {
    type: Number, // years of experience
    default: 0
  },
  coverLetter: {
    type: String,
    trim: true
  },
  cv: {
    type: String // URL or file path to CV
  },
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);