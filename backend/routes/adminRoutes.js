const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/customers/pending', adminController.getPendingCustomers);
router.get('/customers/approved', adminController.getApprovedCustomers);
router.get('/customers', adminController.getAllCustomers);
router.patch('/customers/:customerId/verify', adminController.verifyCustomer);
router.patch('/customers/:customerId/approve', adminController.approveCustomer);
router.patch('/customers/:customerId/reject', adminController.rejectCustomer);

module.exports = router;
