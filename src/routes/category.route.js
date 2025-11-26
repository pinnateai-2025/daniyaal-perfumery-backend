const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { verifyAdmin } = require('../middleware/admin.middleware')


// public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);


// protected routes - admin only
router.post('/',authenticate, verifyAdmin, categoryController.createCategory);;
router.put('/:id',authenticate, verifyAdmin, categoryController.updateCategory);
router.delete('/:id',authenticate, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
