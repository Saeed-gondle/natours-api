# Deploying Natours API to Netlify

This guide provides step-by-step instructions for deploying the Natours API on Netlify using serverless functions.

## Prerequisites

- A Netlify account
- Node.js and npm installed locally
- Git installed locally

## Deployment Steps

### 1. Install Netlify CLI

```bash
npm install netlify-cli -g
```

### 2. Set Up Environment Variables

Run the environment variable extraction script:

```bash
node extract-env-vars.js
```

This will show you all the environment variables from your config.env file that need to be added to Netlify.

### 3. Login to Netlify

```bash
netlify login
```

### 4. Initialize Netlify Site

```bash
netlify init
```

Follow the prompts to either create a new site or connect to an existing one.

### 5. Set Environment Variables in Netlify

Go to your Netlify site dashboard:

1. Navigate to Site settings > Environment variables
2. Add all the variables from your config.env file
   - Make sure to add CONNECTION_STR with your MongoDB Atlas connection string
   - Add JWT_SECRET, JWT_EXPIRES_IN, and other required variables
   - Add NODE_ENV=production

### 6. Deploy to Netlify

```bash
netlify deploy --prod
```

## Testing the Deployment

After deployment, your API will be available at:

- API Root: `https://your-netlify-site-name.netlify.app/api/v1/`
- Documentation: `https://your-netlify-site-name.netlify.app/api/v1/docs`

## Troubleshooting

### Function Timeout Issues

By default, Netlify functions have a 10-second timeout. For operations that might take longer:

1. Go to Site settings > Functions
2. Adjust the "Function timeout" setting (up to 26 seconds)

### MongoDB Connection Issues

- Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow connections from Netlify
- Verify that your MongoDB Atlas user has appropriate permissions
- Check that the CONNECTION_STR environment variable is correctly set in Netlify

### CORS Issues

The application has CORS enabled, but if you encounter issues:

1. Check that cors middleware is properly configured in app.js
2. Test API access from your frontend application

## Local Development with Netlify Functions

To test the serverless functions locally:

```bash
netlify dev
```

This will start the development server with the serverless functions available at `http://localhost:8888/.netlify/functions/api/`.

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Serverless-http Documentation](https://github.com/dougmoscrop/serverless-http)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
