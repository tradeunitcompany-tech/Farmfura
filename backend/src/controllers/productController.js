const Product = require('../models/Product');

// Get all products with optional filters
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'translations.en': { $regex: search, $options: 'i' } },
        { 'translations.kn': { $regex: search, $options: 'i' } },
        { 'translations.hi': { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product (admin only - for seeding)
const createProduct = async (req, res) => {
  try {
    const { name, translations, price, unit, category, image, inStock } = req.body;

    const product = new Product({
      name,
      translations: translations || { en: name, kn: name, hi: name },
      price,
      unit,
      category,
      image,
      inStock,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
