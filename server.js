import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;
mongoose.connect(process.env.CONNECTION_STR).then(() => app.listen(port, () => {
  console.log(`App running on port ${port}...`);
}));
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  app.close(port, () => {
    console.log(`App running on port ${port}...`);
    process.exit(1);
  })
});
process.on('uncaughtException', err => {
  console.log(err.name, err.message); 
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  app.close(port, () => {
    // console.log(`App running on port ${port}...`);
    process.exit(1);
  })
});