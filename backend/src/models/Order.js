const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      unit: String,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 30,
  },
  total: {
    type: Number,
    required: true,
  },
  address: {
    label: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  deliverySlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: 'morning',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['searching', 'assigned', 'on_the_way', 'delivered', 'cancelled'],
    default: 'searching',
  },
  carrier: {
    name: String,
    phone: String,
    vehicle: String,
    rating: Number,
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

module.exports = mongoose.model('Order', orderSchema);
