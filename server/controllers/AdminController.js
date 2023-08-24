// AdminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import Admin model
const Order = require('../models/Order'); // Import Order model

const AdminController = {
  signUp: async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, password: hashedPassword });
      await newAdmin.save();
      res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (error) {
      res.status(500).json({ message: 'Error registering admin', error });
    }
  },

  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '4h', // Change the expiration time to 4 hours
      });
      res.json({ message: 'Login successful', token, admin });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  },

  // ... Other admin functions ...
};

module.exports = AdminController;
