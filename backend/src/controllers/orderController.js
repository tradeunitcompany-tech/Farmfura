const Order = require('../models/Order');
const User = require('../models/User');

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, address, deliverySlot, paymentMethod } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const total = subtotal + (deliveryFee || 30);

    const order = new Order({
      userId,
      items,
      subtotal,
      deliveryFee: deliveryFee || 30,
      total,
      address,
      deliverySlot,
      paymentMethod,
      status: 'searching',
    });

    await order.save();

    // Simulate status updates
    setTimeout(() => {
      Order.findByIdAndUpdate(order._id, { status: 'assigned' }).catch(() => {});
    }, 5000);

    setTimeout(() => {
      Order.findByIdAndUpdate(order._id, { status: 'on_the_way' }).catch(() => {});
    }, 15000);

    setTimeout(() => {
      Order.findByIdAndUpdate(order._id, { status: 'delivered' }).catch(() => {});
    }, 30000);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order status
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Mock carrier data
    const carriers = [
      { name: 'Raj Kumar', phone: '+91 98765 43210', vehicle: 'Bike', rating: 4.8 },
      { name: 'Priya Singh', phone: '+91 97654 32109', vehicle: 'Scooter', rating: 4.9 },
      { name: 'Amit Patel', phone: '+91 96543 21098', vehicle: 'Bike', rating: 4.7 },
    ];

    if (order.status === 'assigned' || order.status === 'on_the_way') {
      order.carrier = carriers[Math.floor(Math.random() * carriers.length)];
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderStatus,
};
