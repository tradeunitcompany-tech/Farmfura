const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/farmfura';
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`⏳ Connecting to MongoDB: ${maskedUri}`);
    await mongoose.connect(uri, {
      family: 4, // Force IPv4
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️ Server will continue to run without DB connection. Please check your IP whitelist.');
  }
};

module.exports = connectDB;
