const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Seed products
app.post('/api/seed-products', async (req, res) => {
  try {
    // Optional: Clear existing products to refresh
    await Product.deleteMany({});

    const products = [
      {
        name: 'Tomato',
        price: 50,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Tomato',
        inStock: true,
        stock: 100,
      },
      {
        name: 'Onion',
        price: 40,
        unit: 'kg',
        category: 'roots',
        image: 'https://via.placeholder.com/150?text=Onion',
        inStock: true,
        stock: 150,
      },
      {
        name: 'Spinach',
        price: 30,
        unit: 'bundle',
        category: 'leafy',
        image: 'https://via.placeholder.com/150?text=Spinach',
        inStock: true,
        stock: 80,
      },
      {
        name: 'Carrot',
        price: 60,
        unit: 'kg',
        category: 'roots',
        image: 'https://via.placeholder.com/150?text=Carrot',
        inStock: true,
        stock: 120,
      },
      {
        name: 'Cucumber',
        price: 45,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Cucumber',
        inStock: true,
        stock: 90,
      },
      {
        name: 'Coriander',
        price: 25,
        unit: 'bundle',
        category: 'herbs',
        image: 'https://via.placeholder.com/150?text=Coriander',
        inStock: true,
        stock: 70,
      },
      {
        name: 'Broccoli',
        price: 80,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Broccoli',
        inStock: true,
        stock: 50,
      },
      {
        name: 'Potato',
        price: 35,
        unit: 'kg',
        category: 'roots',
        image: 'https://via.placeholder.com/150?text=Potato',
        inStock: true,
        stock: 200,
      },
      {
        name: 'Bell Pepper',
        price: 70,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Bell+Pepper',
        inStock: true,
        stock: 60,
      },
      {
        name: 'Mint',
        price: 20,
        unit: 'bundle',
        category: 'herbs',
        image: 'https://via.placeholder.com/150?text=Mint',
        inStock: true,
        stock: 100,
      },
      {
        name: 'Ash Gourd',
        price: 45,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Ash+Gourd',
        inStock: true,
        stock: 40,
      },
      {
        name: 'French Beans',
        price: 60,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=French+Beans',
        inStock: true,
        stock: 60,
      },
      {
        name: 'Bitter Gourd',
        price: 55,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://via.placeholder.com/150?text=Bitter+Gourd',
        inStock: true,
        stock: 50,
      },
      {
        name: 'Beetroot',
        price: 50,
        unit: 'kg',
        category: 'roots',
        image: 'https://via.placeholder.com/150?text=Beetroot',
        inStock: true,
        stock: 80,
      },
      {
        name: 'Red Amaranth',
        price: 25,
        unit: 'bundle',
        category: 'leafy',
        image: 'https://via.placeholder.com/150?text=Red+Amaranth',
        inStock: true,
        stock: 100,
      },
    ];

    await Product.insertMany(products);
    res.json({ success: true, message: 'Products seeded successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Seed products: POST http://localhost:${PORT}/api/seed-products`);
});
