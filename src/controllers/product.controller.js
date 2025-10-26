const {Product, Category} = require('../models/index');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const newProduct = await Product.create({ name, description, price, stock, categoryId });
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all products with category details
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }]
        });
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, categoryId } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await product.update({ name, description, price, stock, categoryId });
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await product.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
        