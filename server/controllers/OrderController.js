const Order = require('../models/Order');

const orderController = {
  // Function to create a new order
  createOrder: async (req, res) => {
    try {
        const {
          orderNumber,
          translationType,
          user,
          sourceLanguage,
          targetLanguage,
          deliveryOption,
          numPages,
          totalAmount,
        } = req.body;
      // Generate a unique order number (you can customize the format)

      const newOrder = new Order({
        orderNumber,
        user,
        translationType,
        sourceLanguage,
        targetLanguage,
        deliveryOption,
        numPages,
        totalAmount,
      });
      await newOrder.save();
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  },

  // Function to get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }); // Retrieve orders for the authenticated user
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Error getting orders', error });
    }
  },

  // Function to get a specific order by ID
  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findOne({ _id: orderId, user: req.user._id }); // Retrieve order for the authenticated user
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: 'Error getting order', error });
    }
  },

  // Function to update the status of an order
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      await Order.findOneAndUpdate({ _id: orderId, user: req.user._id }, { status }, { new: true });
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status', error });
    }
  },

  // Function to delete an order
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      await Order.findOneAndDelete({ _id: orderId, user: req.user._id });
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error });
    }
  },
};

// Generate a unique order number (example function, you can modify as needed)
function generateOrderNumber() {
    // Logic to generate a unique order number based on timestamp, user ID, etc.
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    const orderNumber = `${timestamp}-${randomPart}`;
    return orderNumber;
  }
  
  module.exports = orderController;