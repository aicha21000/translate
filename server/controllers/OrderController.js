// orderController.js
const Order = require('../models/Order');
const upload = require('../config/Multer');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const {
        orderNumber,
        user,
        translationType,
        sourceLanguage,
        targetLanguage,
        deliveryOption,
        numPages,
        totalAmount,
      } = req.body;
      // Get the filenames of the uploaded files
      const uploadedFiles = req.files.map(file => file.filename);



      const newOrder = new Order({
        orderNumber,
        user,
        translationType,
        sourceLanguage,
        targetLanguage,
        deliveryOption,
        numPages,
        sendFile: uploadedFiles, // Attach the filenames to the sendFile field
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



  uploadFile: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const file = req.file; // Fichier traduit téléchargé

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Mettez à jour l'enregistrement de la commande avec le nom du fichier traduit
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $push: { translatedFile: file.filename },
          $set: { status: 'translated' }
        },
        { new: true }
      );


      res.status(200).json({ message: 'Translated file uploaded successfully', order });
    } catch (error) {
      console.error('Error uploading translated file:', error);
      res.status(500).json({ message: 'Error uploading translated file', error });
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