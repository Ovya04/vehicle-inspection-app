const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, inspectorValidation, customerValidation } = require('../middleware/validation');

const router = express.Router();

// Inspector Routes
router.post('/inspector/register', inspectorValidation, validateRequest, authController.inspectorRegister);
router.post('/inspector/login', authController.inspectorLogin);

// Customer Routes
router.post('/customer/register', customerValidation, validateRequest, authController.customerRegister);
router.post('/customer/login', authController.customerLogin);

// Admin Routes
router.post('/admin/login', authController.adminLogin);

// Get Current User
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;