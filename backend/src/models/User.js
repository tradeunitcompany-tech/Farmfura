const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple nulls/empty strings
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  addresses: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      label: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      isDefault: Boolean,
    },
  ],
  otpAttempts: {
    type: Number,
    default: 0,
  },
  lastOtpTime: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
