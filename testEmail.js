const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to take our messages');
    
    // Send a test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from Job Portal',
      text: 'This is a test email from the job portal application.'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Error sending test email:', err);
      } else {
        console.log('Test email sent successfully:', info.response);
      }
    });
  }
});