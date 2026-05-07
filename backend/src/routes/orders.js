const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, getUserOrders, getOrderStatus } = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/user/:userId', verifyToken, getUserOrders);
router.get('/status/:orderId', getOrderStatus);

module.exports = router;
