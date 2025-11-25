const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware')

// All routes require admin role
router.get('/dashboard', authenticate, verifyAdmin, admin.getDashboard);

// Users
router.get('/users', authenticate, verifyAdmin, admin.listUsers);
router.get('/users/:id', authenticate, verifyAdmin, admin.getUser);
router.put('/users/:id', authenticate, verifyAdmin, admin.updateUser);
router.delete('/users/:id', authenticate, verifyAdmin, admin.deleteUser);

// Sales analytics
router.get('/sales/summary', authenticate, verifyAdmin, admin.salesSummary);
router.get('/sales/trends', authenticate, verifyAdmin, admin.salesTrends);

// Product performance
router.get('/products/performance', authenticate, verifyAdmin, admin.productPerformance);

module.exports = router;
