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
      required: true
    },
    company: {
      type: String,
      required: true
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
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);
