const User = require('../models/User');
const mongoose = require('mongoose');

// Get user profile
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add address
const addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { label, address, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      label,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    };

    // If this is the default, unset others
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.json({
      success: true,
      message: 'Address added',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  addAddress,
  updateUser,
};
