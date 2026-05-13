const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    jobId: {
      type: String,
      unique: true,
      default: function () {
        // Auto-generate job ID like JOB-<shortid>
        return 'JOB-' + new mongoose.Types.ObjectId().toString().slice(-6).toUpperCase();
      },
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
    },

    description: {
      type: String,
    },

    locationType: {
      type: String,
      enum: ['Sri Lanka', 'Overseas'],
      default: 'Sri Lanka',
    },

    district: {
      type: String,
    },

    city: {
      type: String,
    },

    country: {
      type: String,
    },

    salary: {
      type: String,
    },

    educationLevel: {
      type: String,
    },

    qualificationLevel: {
      type: [String], // array of strings
      default: [],
    },

    rolesAndResponsibilities: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    deadline: {
      type: Date,
      default: function () {
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        return oneMonthLater;
      },
    },

    email: {
      type: String, // company or custom email for CVs
    },

    image: {
      type: String, // image URL or file path
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false,
    },

    companyName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
