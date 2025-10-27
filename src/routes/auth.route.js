const express = require('express');
const router = express.Router();
require('dotenv').config();

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// ✅ User registration
router.post('/register', authController.register);

// ✅ User login
router.post('/login', authController.login);

// ✅ Get user profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// ✅ Update user profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

// ✅ Change user password (protected)
router.put('/profile/password', authenticate, authController.changePassword);

// ✅ User logout (protected)
router.post('/logout', authenticate, authController.logout);

// ✅ Password reset (public)
router.post('/reset-password', authController.resetPassword);

module.exports = router;
