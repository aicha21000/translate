const express = require('express');
const orderController = require('../controllers/OrderController');
const router = express.Router();

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get all orders
router.get('/', orderController.getAllOrders);

// Route to get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Route to update the status of an order
router.put('/:id', orderController.updateOrderStatus);

// Route to delete an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
