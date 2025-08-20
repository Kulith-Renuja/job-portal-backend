# Email Configuration Setup

To enable email functionality in the job portal application, follow these steps:

## For Gmail (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification
   - Turn on 2-Step Verification

2. **Generate App Password**
   - In Google Account settings, go to Security > 2-Step Verification > App passwords
   - Under "Select app", choose "Mail"
   - Under "Select device", choose "Other" and name it "Job Portal"
   - Click "Generate"
   - Copy the generated 16-character password (remove spaces)

3. **Update .env File**
   - Open `server/.env`
   - Replace `your_email@gmail.com` with your actual Gmail address
   - Replace `your_app_password_here` with the generated app password

## For Other Email Providers

If you're using another email provider (Outlook, Yahoo, etc.), update the emailService.js file:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-email-provider-smtp-server',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Testing Email Configuration

1. After updating the .env file, run the test script:
   ```
   cd server
   npm run test-email
   ```

2. Check your inbox for a test email from the application

## Troubleshooting

- If you get authentication errors, double-check your credentials
- Ensure you're using an App Password, not your regular password for Gmail
- Check that 2-Factor Authentication is enabled on your Google account
- Make sure the "Less secure app access" setting is not blocking the connection (though App Passwords should work regardless)

## Security Notes

- Never commit your actual email credentials to version control
- The .env file is included in .gitignore to prevent credential leaks
- Use App Passwords instead of your regular password for Gmail