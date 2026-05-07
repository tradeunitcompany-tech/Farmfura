const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getUser, addAddress, updateUser } = require('../controllers/userController');

const { emailRegister } = require('../controllers/authController');

router.post('/register', emailRegister);
router.get('/:id', verifyToken, getUser);
router.post('/:userId/address', verifyToken, addAddress);
router.put('/:id', verifyToken, updateUser);

module.exports = router;
