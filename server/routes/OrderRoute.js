const express = require('express');
const orderController = require('../controllers/OrderController');
const router = express.Router();


const upload = require('../config/Multer'); // Update the path to the multer configuration file



// Route to create a new order
router.post('/',
    upload.array('sendFile', 10),

    orderController.createOrder);

// Route to get all orders
router.get('/', orderController.getAllOrders);

// Route to get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Route to update the status of an order
router.put('/:id', orderController.updateOrderStatus);

// Route to delete an order
router.delete('/:id', orderController.deleteOrder);

// Route pour télécharger un fichier
router.post('/upload-file/:orderId', upload.single('file'), orderController.uploadFile);


module.exports = router;
