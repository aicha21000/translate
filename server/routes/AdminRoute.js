// AdminRoute.js
const express = require('express');
const adminController = require('../controllers/AdminController');
const router = express.Router();

router.post('/signup', adminController.signUp);
router.post('/signin', adminController.signIn);
router.get('/orders/pending', adminController.getPendingOrders);
router.get('/orders/validated', adminController.getValidatedOrders);
router.get('/orders/completed', adminController.getCompletedOrders);
router.get('/orders/cancelled', adminController.getCancelledOrders);
router.post('/orders/:id/assign', adminController.assignTranslator);
router.get('/translators', adminController.getTranslator);
router.get('/translators/available', adminController.getAvailableTranslators);

module.exports = router;






// router.get('/orders', adminController.getPendingOrders);
// router.put('/orders/:id/assign', adminController.assignTranslator);
// ... Other admin routes ...

module.exports = router;
