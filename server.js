import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Set DNS to use Google's public DNS to resolve MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

let server;

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

// MongoDB connection configuration for Atlas
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log(
      '🌐 Using connection string:',
      process.env.CONNECTION_STR.replace(/:[^:@]*@/, ':****@')
    );

    const clientOptions = {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.CONNECTION_STR, clientOptions);

    // Test the connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('🏓 Database ping successful!');
    console.log('📊 Connected to database:', mongoose.connection.name);

    // Start the server after successful DB connection
    server = app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
      console.log(`📖 API Documentation: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(`   ${error.message}`);
    console.error('\n🚨 Connection Details:');
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);
    console.error('\n💡 Troubleshooting:');
    console.error('1. MongoDB Compass works, but Node.js fails');
    console.error('2. This suggests a Node.js DNS or network issue');
    console.error('3. Try running: npm install --save-dev --legacy-peer-deps');
    console.error('4. Check if antivirus is blocking Node.js network access');

    process.exit(1);
  }
};

// Start the application
connectDB();

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
