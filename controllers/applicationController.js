const Job = require('../models/Job');
const User = require('../models/User');
const { sendApplicationNotification, sendApplicationConfirmation } = require('../utils/emailService');

const EDUCATION_ORDER = { 'high-school': 1, diploma: 2, bachelor: 3, master: 4, doctorate: 5 };

function parseEducation(body) {
if (body.education && body.education.level) return body.education;
return {
level: (body['education[level]'] || '').toLowerCase(),
institution: body['education[institution]'] || '',
fieldOfStudy: body['education[fieldOfStudy]'] || '',
graduationYear: body['education[graduationYear]'] || ''
};
}

exports.submitApplication = async (req, res) => {
try {
const edu = parseEducation(req.body);
const payload = {
jobId: req.body.jobId,
name: req.body.name,
email: req.body.email,
phone: req.body.phone,
education: {
level: String(edu.level || '').toLowerCase(),
institution: edu.institution,
fieldOfStudy: edu.fieldOfStudy,
graduationYear: Number(edu.graduationYear || 0)
},
experience: Number(req.body.experience || 0),
coverLetter: req.body.coverLetter || ''
};
// 1) Job
const job = await Job.findById(payload.jobId);
if (!job) return res.status(404).json({ message: 'Job not found' });

// 2) Determine recipient
// Priority: job.applicationEmail (admin or company can set)
let recipient = (job.applicationEmail || '').trim();

// If not provided, fallback to job owner
if (!recipient && job.companyId) {
  const owner = await User.findById(job.companyId).select('role contactEmail email companyName name');
  if (owner) {
    // For company role: prefer contactEmail, else account email
    if (owner.role === 'company') {
      recipient = owner.contactEmail || owner.email || '';
    } else if (owner.role === 'admin') {
      // For admin postings without applicationEmail, fallback to admin email
      recipient = owner.email || '';
    }
  }
}
if (!recipient) {
  return res.status(400).json({ message: 'No application recipient configured for this job' });
}

// 3) Education filter
const reqLevel = (job.requiredEducationLevel || '').toLowerCase();
const minLevel = EDUCATION_ORDER[reqLevel] || 0;
const applLevel = EDUCATION_ORDER[payload.education.level] || 0;
const meetsLevel = applLevel >= minLevel;

let meetsField = true;
if (job.requiredFieldOfStudy) {
  const reqField = String(job.requiredFieldOfStudy).toLowerCase();
  const applField = String(payload.education.fieldOfStudy || '').toLowerCase();
  meetsField = applField.includes(reqField);
}

let meetsGrad = true;
if (job.minGraduationYear) {
  meetsGrad = Number(payload.education.graduationYear || 0) >= Number(job.minGraduationYear);
}

const meets = meetsLevel && meetsField && meetsGrad;

// 4) Attach CV (memory)
const attachments = [];
if (req.file) {
  attachments.push({
    filename: req.file.originalname,
    content: req.file.buffer,
    contentType: req.file.mimetype
  });
}

// 5) Email
if (meets) {
  await sendApplicationNotification(
    recipient,
    payload,
    { title: job.title, company: job.companyName || 'Company' },
    attachments
  );
}
await sendApplicationConfirmation(
  payload.email,
  { title: job.title, company: job.companyName || 'Company' }
);

return res.status(201).json({
  message: meets
    ? 'Application submitted and sent to company'
    : 'Application submitted (did not match requirements; not sent to company)',
  meetsEducation: meets
});
} catch (err) {
console.error('Application submission error:', err);
res.status(500).json({ message: 'Failed to submit application', error: err.message });
}
};