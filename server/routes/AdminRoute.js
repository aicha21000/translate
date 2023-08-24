const express = require('express');
const adminController = require('../controllers/AdminController');
const router = express.Router();

router.post('/signup', adminController.signUp);
router.post('/signin', adminController.signIn);
// router.get('/orders', adminController.getPendingOrders);
// router.put('/orders/:id/assign', adminController.assignTranslator);
// ... Other admin routes ...

module.exports = router;
