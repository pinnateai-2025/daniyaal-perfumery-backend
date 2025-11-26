const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware');


// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes - admin only
router.post('/', authenticate, verifyAdmin,upload.single('image'), productController.createProduct);
router.put('/:id', authenticate, verifyAdmin,upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticate, verifyAdmin, productController.deleteProduct);

module.exports = router;
