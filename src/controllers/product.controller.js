const { Product, Category } = require("../models");
const cloudinary = require("../config/cloudinary");

// Extract Cloudinary publicId from URL
const extractPublicId = (url) => {
  if (!url) return null;

  // Regex to capture public_id
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v169999/somefolder/abc123.jpg
  const match = url.match(/\/(?:v\d+\/)?([^\/]+)\.[a-zA-Z0-9]+$/);

  return match ? match[1] : null;
};

// CREATE PRODUCT (supports image upload)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, size, fragranceNotes } = req.body;

    const imageUrl = req.file ? (req.file.path || req.file.secure_url) : null;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      size,
      fragranceNotes
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: "category" }]
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: "category" }]
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE PRODUCT (handles image replace + delete old image)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const { name, description, price, stock, categoryId, size, fragranceNotes } = req.body;

    // If new image uploaded → delete old one from Cloudinary
    if (req.file) {
      const oldUrl = product.imageUrl;
      if (oldUrl) {
        const publicId = extractPublicId(oldUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
          } catch (err) {
            console.warn("Failed to delete old Cloudinary image:", err.message);
          }
        }
      }

      // Set new image URL
      product.imageUrl = req.file.path || req.file.secure_url;
    }

    // Update other fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.categoryId = categoryId ?? product.categoryId;
    product.size = size ?? product.size;
    product.fragranceNotes = fragranceNotes ?? product.fragranceNotes;

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE PRODUCT (also delete image)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.imageUrl) {
      const publicId = extractPublicId(product.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch (err) {
          console.warn("Cloudinary delete failed:", err.message);
        }
      }
    }

    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
