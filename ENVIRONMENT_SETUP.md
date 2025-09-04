# Environment Setup

## Important Security Notice
**NEVER commit the `config.env` file to Git!** It contains sensitive information like API keys, passwords, and database credentials.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp config.env.example config.env
   ```

2. **Fill in your actual values in `config.env`:**
   - `CONNECTION_STR`: Your MongoDB Atlas connection string
   - `PASSWORD`: Your MongoDB password
   - `JWT_SECRET`: A secure random string (at least 32 characters)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - Email credentials for your chosen email service

3. **The `config.env` file is automatically ignored by Git** (listed in `.gitignore`)

## Required Environment Variables

### Database
- `CONNECTION_STR`: MongoDB Atlas connection string
- `PASSWORD`: MongoDB password

### Authentication
- `JWT_SECRET`: JWT signing secret (keep it secure!)
- `JWT_EXPIRES_IN`: Token expiration time

### Payments
- `STRIPE_SECRET_KEY`: Stripe secret key for payments

### Email Service
Choose one email configuration:

#### Option 1: Mailtrap (for development/testing)
- `EMAIL_HOST`: sandbox.smtp.mailtrap.io
- `EMAIL_PORT`: 587
- `EMAIL_USERNAME`: Your Mailtrap username
- `EMAIL_PASSWORD`: Your Mailtrap password

#### Option 2: Gmail (for production)
- `EMAIL_HOST_PROD`: smtp.gmail.com
- `EMAIL_PORT_PROD`: 587
- `EMAIL_USERNAME_PROD`: Your Gmail address
- `EMAIL_PASSWORD_PROD`: Your Gmail App Password

## Security Best Practices

1. **Never commit sensitive files**: `config.env` is in `.gitignore`
2. **Use environment variables in production**: Set them directly on your hosting platform
3. **Rotate secrets regularly**: Change passwords and API keys periodically
4. **Use different credentials for development and production**
