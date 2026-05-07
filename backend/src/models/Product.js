const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ['kg', 'bundle', 'piece'],
    default: 'kg',
  },
  category: {
    type: String,
    enum: ['leafy', 'roots', 'vegetables', 'herbs', 'other'],
    required: true,
  },
  image: {
    type: String,
    default: '/images/default-product.png',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
