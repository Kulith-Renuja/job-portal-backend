const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Company Info
  name: { type: String, required: true, trim: true },
  telephone: { type: String },
  country: { type: String, required: true },
  address: { type: String },
  industry: { type: String, required: true },     // dropdown
  companySize: { type: String, required: true },  // dropdown
  brNumber: { type: String },

  // Contact Person
  contactPerson: {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    mobile: { type: String, required: true }
  },

  // Package Info
  package: {
    type: { type: String, default: "free" },   // free/silver/gold
    totalPosts: { type: Number, default: 0 },
    remainingPosts: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ["active", "deactivated"],
    default: "active"
  },

}, { timestamps: true });

// Hash password before saving
companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
companySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);
