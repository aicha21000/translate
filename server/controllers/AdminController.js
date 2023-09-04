// AdminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Translator = require('../models/Translator'); // Import Translator model



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
  getPendingOrders: async (req, res) => {
    try {
      const pendingOrders = await Order.find({ status: 'pending' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage user status createdAt ');

      res.json({ orders: pendingOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pending orders', error });
    }
  },
  getAssignedOrders: async (req, res) => {
    try {
      const assignedOrders = await Order.find({ status: 'assigned' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage translator status createdAt user translator   ');

      res.json({ orders: assignedOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching assigned orders', error });
    }
  },
  getTranslatedOrders: async (req, res) => {
    try {
      const translatedOrders = await Order.find({ status: 'translated' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage user translator');

      res.json({ orders: translatedOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching translated orders', error });
    }
  },
  getCompletedOrders: async (req, res) => {
    try {
      const completedOrders = await Order.find({ status: 'completed' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage user translator');

      res.json({ orders: completedOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching completed orders', error });
    }
  },
  getCancelledOrders: async (req, res) => {
    try {
      const cancelledOrders = await Order.find({ status: 'cancelled' })
        .populate('user', 'username') // Populate the 'user' field with username
        .select('orderNumber sourceLanguage targetLanguage translator status createdAt user translator   ');

      res.json({ orders: cancelledOrders });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cancelled orders', error });
    }
  },


  // Fonction pour récupérer la liste des traducteurs (admin)
  getTranslator: async (req, res) => {
    try {
      const translators = await Translator.find();
      res.json({ translators });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching translators', error });
    }
  },




  getAvailableTranslators: async (req, res) => {
    try {
      const { sourceLanguage, targetLanguage } = req.query;
      const translators = await Translator.find({
        nativeLanguage: sourceLanguage,
        workingLanguages: targetLanguage,
      });
      res.json({ translators });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available translators', error });
    }


  },

  // annuler une commande
  cancelOrder: async (req, res) => {
    try {
      const orderId = req.params.id;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'cancelled' },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling order', error });
    }
  },





  // Updated assignTranslator function
  assignTranslator: async (req, res) => {
    try {
      const orderId = req.params.id;
      const { translatorId } = req.body; // Use req.body.translatorId to get the translator ID

      console.log('orderId:', orderId);
      // Find the order by its orderId
      const order = await Order.findById(orderId);
      console.log('order:', order);
      console.log('translatorId:', translatorId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Find the selected translator by its translatorId
      const translator = await Translator.findById(translatorId);
      if (!translator) {
        return res.status(404).json({ message: 'Translator not found' });
      }

      // Assign the translator to the order
      order.translator = translator;
      order.status = 'assigned';

      await order.save();

      res.json({ message: 'Translator assigned successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning translator', error });
    }
  },


  // Assigner un autre traducteur à une commande

  unassignTranslator: async (req, res) => {
    try {
      const orderId = req.params.id;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { translator: null, status: 'pending' },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Translator unassigned successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error unassigning translator', error });
    }
  },

  // Reactivate a cancelled order
  reactivateOrder: async (req, res) => {
    try {
      const orderId = req.params.id;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'pending', translator: null }, // Change the status to 'pending' and remove the translator assignment
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Order reactivated successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Error reactivating order', error });
    }
  },









}
module.exports = AdminController;
