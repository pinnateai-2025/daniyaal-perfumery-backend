const {Category} = require('../models/');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await Category.create({ name, description });
        return res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.status(200).json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        await category.update({ name, description });
        return res.status(200).json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        await category.destroy();

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
