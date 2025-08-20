const Application = require('../models/Application');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { sendApplicationNotification, sendApplicationConfirmation } = require('../utils/emailService');

// @desc    Submit job application
// @route   POST /api/v1/applications
// @access  Public
exports.submitApplication = async (req, res) => {
  try {
    // Extract data from request
    const {
      jobId,
      name,
      email,
      phone,
      education,
      experience,
      coverLetter
    } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if company exists and is approved
    const company = await Company.findOne({ companyName: job.company });
    if (!company || company.status !== 'approved') {
      return res.status(400).json({ message: 'Company not approved to receive applications' });
    }

    // Handle CV upload if present
    let cvUrl = null;
    if (req.file) {
      cvUrl = req.file.path; // Assuming you're using multer for file uploads
    }

    // Create application record
    const application = await Application.create({
      job: jobId,
      name,
      email,
      phone,
      education,
      experience: experience || 0,
      coverLetter,
      cv: cvUrl
    });

    // Send emails
    // Send notification to company
    const companyNotificationResult = await sendApplicationNotification(
      company.contactEmail,
      { name, email, phone, education, experience, coverLetter },
      { title: job.title, company: job.company }
    );

    // Send confirmation to applicant
    const applicantConfirmationResult = await sendApplicationConfirmation(
      email,
      { title: job.title, company: job.company }
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
      emails: {
        companyNotification: companyNotificationResult,
        applicantConfirmation: applicantConfirmationResult
      }
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ message: 'Failed to submit application', error: err.message });
  }
};

// @desc    Get job applications
// @route   GET /api/v1/applications/job/:jobId
// @access  Private
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('job', 'title company');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
};

// @desc    Get filtered applications for company
// @route   GET /api/v1/applications/company/:companyId/filtered
// @access  Private
exports.getFilteredApplications = async (req, res) => {
  try {
    // Get all jobs for this company
    const jobs = await Job.find({ company: req.params.companyId });
    const jobIds = jobs.map(job => job._id);
    
    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company requiredEducationLevel requiredFieldOfStudy minGraduationYear');
    
    // Filter applications based on job requirements
    const filteredApplications = applications.filter(application => {
      const job = application.job;
      
      // If job has no specific requirements, include all applications
      if (!job.requiredEducationLevel && !job.requiredFieldOfStudy && !job.minGraduationYear) {
        return true;
      }
      
      // Check education level requirement
      if (job.requiredEducationLevel) {
        const educationHierarchy = {
          'high-school': 1,
          'diploma': 2,
          'bachelor': 3,
          'master': 4,
          'doctorate': 5
        };
        
        const requiredLevel = educationHierarchy[job.requiredEducationLevel] || 0;
        const applicantLevel = educationHierarchy[application.education.level] || 0;
        
        if (applicantLevel < requiredLevel) {
          return false;
        }
      }
      
      // Check field of study requirement
      if (job.requiredFieldOfStudy && application.education.fieldOfStudy) {
        if (!application.education.fieldOfStudy.toLowerCase().includes(job.requiredFieldOfStudy.toLowerCase())) {
          return false;
        }
      }
      
      // Check graduation year requirement
      if (job.minGraduationYear && application.education.graduationYear) {
        if (parseInt(application.education.graduationYear) < parseInt(job.minGraduationYear)) {
          return false;
        }
      }
      
      return true;
    });
    
    res.json(filteredApplications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch filtered applications', error: err.message });
  }
};