const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware')


// Public route
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/',authenticate, verifyAdmin, productController.createProduct);
router.put('/:id',authenticate, verifyAdmin, productController.updateProduct);
router.delete('/:id',authenticate,verifyAdmin, productController.deleteProduct);

module.exports = router;
