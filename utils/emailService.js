const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendApplicationNotification = async (
  to,
  applicationData,
  jobData,
  attachments = []
) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `New Application – ${jobData.title}`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Job:</strong> ${jobData.title}</p>
      <p><strong>Applicant:</strong> ${applicationData.name}</p>
      <p><strong>Email:</strong> ${applicationData.email}</p>
      <p><strong>Phone:</strong> ${applicationData.phone}</p>

      <h3>Education</h3>
      <p><strong>Level:</strong> ${applicationData.education.level}</p>
      <p><strong>Institution:</strong> ${applicationData.education.institution}</p>
      <p><strong>Field:</strong> ${applicationData.education.fieldOfStudy}</p>
      <p><strong>Graduation Year:</strong> ${applicationData.education.graduationYear}</p>

      ${
        applicationData.experience
          ? `<p><strong>Experience:</strong> ${applicationData.experience} years</p>`
          : ''
      }

      ${
        applicationData.coverLetter
          ? `<h3>Cover Letter</h3><p>${applicationData.coverLetter}</p>`
          : ''
      }
    `,
    attachments,
  });
};

exports.sendApplicationConfirmation = async (to, jobData) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Application Received – ${jobData.title}`,
    html: `
      <p>Thanks for applying for <strong>${jobData.title}</strong> at ${jobData.company}.</p>
      <p>We’ve received your application.</p>
    `,
  });
};
