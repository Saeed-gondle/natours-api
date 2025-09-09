import dotenv from 'dotenv';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import app from '../../app.js';

// Load environment variables
dotenv.config({ path: './config.env' });

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
