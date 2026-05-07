const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, emailRegister, emailLogin, logout } = require('../controllers/authController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', emailRegister);
router.post('/login', emailLogin);
router.post('/logout', logout);

module.exports = router;
