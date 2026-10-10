const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware);
router.use(requireRole('admin'));

// Customer management
router.get('/customers/pending', adminController.getPendingCustomers);
router.get('/customers/verified', adminController.getVerifiedCustomers);
router.get('/customers', adminController.getAllCustomers);
router.patch('/customers/:customerId/verify', adminController.verifyCustomer);
router.patch('/customers/:customerId/approve', adminController.approveCustomer);
router.patch('/customers/:customerId/reject', adminController.rejectCustomer);

// Inspector management
router.get('/inspectors', adminController.getAllInspectors);

module.exports = router;