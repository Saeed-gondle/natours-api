import dotenv from 'dotenv';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Set up __dirname equivalent for ES modules
let __filename;
let __dirname;
let rootDir;

try {
  // Standard approach for ES modules in Node.js
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
  rootDir = path.resolve(__dirname, '../..');
  console.log('Serverless function paths:', { 
    __dirname,
    rootDir,
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Error setting up paths in serverless function:', error.message);
  rootDir = process.cwd();
  __dirname = rootDir;
}

// Load environment variables - try multiple locations
try {
  // First try config.env in the root directory
  const envPath = path.join(rootDir, 'config.env');
  
  if (fs.existsSync(envPath)) {
    console.log(`Loading env from ${envPath}`);
    dotenv.config({ path: envPath });
  } else {
    // If not found, try to load from process.env (Netlify environment variables)
    console.log('No config.env found, using process.env');
    dotenv.config();
  }
} catch (error) {
  console.error('Error loading environment variables:', error);
  // Continue anyway, we'll use process.env
  dotenv.config();
}

// Import the Express app after environment setup
import app from '../../app.js';

// Initialize database connection
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  console.log('Creating new database connection');

  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  };

  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.CONNECTION_STR, clientOptions);

    // Test the connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');

    cachedDb = mongoose.connection;
    return cachedDb;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(`   ${error.message}`);
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    throw error;
  }
};

// Wrap the Express app in serverless-http
const serverlessHandler = serverless(app);

// Export the serverless handler
export const handler = async (event, context) => {
  // Make the database connection available for reuse
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to the database
    await connectToDatabase();

    // Pass the request to the Express app
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Error in serverless function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        message: 'Internal server error',
      }),
    };
  }
};
