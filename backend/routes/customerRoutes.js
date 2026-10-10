const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, customerValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/', authMiddleware, customerController.getAllCustomers);
router.post('/', authMiddleware, customerValidation, validateRequest, customerController.createCustomer);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;