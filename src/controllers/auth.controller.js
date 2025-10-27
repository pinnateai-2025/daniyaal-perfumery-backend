const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User} = require("../models");

// User registration
exports.register = async (req, res) => {
  try {
    const {name, email, password, phone, address, role} = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role
    });
    res.status(201).json({message: "User registered successfully", user: newUser});
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({where: {email}});
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: "Invalid password"});
    }

    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "7d"});
    res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({user});
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Change user password
exports.changePassword = async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({message: "Invalid old password"});
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({message: "Password changed successfully"});
  } catch (error) {
    console.error("Error changing user password:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

// User logout
exports.logout = async (req, res) => {
  try {
    // Invalidate the user's token (implementation depends on your auth strategy)
    res.status(200).json({message: "Logout successful"});
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

// Password reset (forgot password)
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a password reset token (implementation depends on your auth strategy)
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Send the reset token to the user's email (implementation depends on your email service)
    res.status(200).json({ message: "Password reset link sent to email", resetToken });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = exports;
