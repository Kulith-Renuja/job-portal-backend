const nodemailer = require('nodemailer');

// Create transporter (using Gmail as example - replace with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send application notification to company
exports.sendApplicationNotification = async (companyEmail, applicationData, jobData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: companyEmail,
      subject: `New Job Application for ${jobData.title}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Job:</strong> ${jobData.title}</p>
        <p><strong>Applicant Name:</strong> ${applicationData.name}</p>
        <p><strong>Email:</strong> ${applicationData.email}</p>
        <p><strong>Phone:</strong> ${applicationData.phone}</p>
        <h3>Education Details</h3>
        <p><strong>Level:</strong> ${applicationData.education.level}</p>
        <p><strong>Institution:</strong> ${applicationData.education.institution}</p>
        <p><strong>Field of Study:</strong> ${applicationData.education.fieldOfStudy}</p>
        <p><strong>Graduation Year:</strong> ${applicationData.education.graduationYear}</p>
        ${applicationData.experience ? `<p><strong>Experience:</strong> ${applicationData.experience} years</p>` : ''}
        ${applicationData.coverLetter ? `<h3>Cover Letter</h3><p>${applicationData.coverLetter}</p>` : ''}
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Application notification sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending application notification:', error);
    return { success: false, error: error.message };
  }
};

// Send application confirmation to applicant
exports.sendApplicationConfirmation = async (applicantEmail, jobData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: applicantEmail,
      subject: `Job Application Confirmation for ${jobData.title}`,
      html: `
        <h2>Job Application Confirmation</h2>
        <p>Thank you for applying for the position of <strong>${jobData.title}</strong>.</p>
        <p>We have received your application and will review it shortly.</p>
        <p>Best regards,<br/>${jobData.company} Team</p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Application confirmation sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending application confirmation:', error);
    return { success: false, error: error.message };
  }
};