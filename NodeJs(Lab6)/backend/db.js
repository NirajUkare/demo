import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore';
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, { dbName: 'bookstore' });
    console.log(`✅ MongoDB connected: ${mongoUri}`);
    mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
export default connectDB;
