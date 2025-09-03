# Job Portal Server

This is the backend server for the Job Portal application.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` (if it exists) or update the existing `.env` file with your configuration.

3. **Email Configuration**:
   - Follow the instructions in [EMAIL_SETUP.md](EMAIL_SETUP.md) to configure email functionality
   - This is required for sending application notifications to companies and confirmation emails to applicants

4. Start the server:
   ```
   npm start
   ```

## Available Scripts

- `npm start` - Start the server
- `npm test-email` - Test email configuration

## API Endpoints

The server provides RESTful APIs for:
- User authentication and management
- Company registration and management
- Job posting and management
- Job applications
- Admin functionalities

## Database

The application uses MongoDB as its database. Make sure MongoDB is running on your system or update the MONGO_URI in your `.env` file to point to your database.

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `EMAIL_USER` - Email address for sending notifications
- `EMAIL_PASS` - Password or app password for email account