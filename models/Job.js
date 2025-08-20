const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    place: {
      type: String,
    },
    company: {
      type: String,
    },
    category: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String // URL or file path
    },
    salary: {
      type: Number, // or String if you want 'Negotiable'
      default: null
    },
    jobType: {
      type: String, // e.g., 'Full-time', 'Part-time', 'Internship'
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time'
    },
    deadline: {
      type: Date
    },
    // Education requirements
    requiredEducationLevel: {
      type: String,
      enum: ['high-school', 'diploma', 'bachelor', 'master', 'doctorate']
    },
    requiredFieldOfStudy: {
      type: String,
      trim: true
    },
    minGraduationYear: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);
