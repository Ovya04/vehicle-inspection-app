const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, customerController.getAllCustomers);
router.post('/', authMiddleware, customerController.createCustomer);
router.get('/:id', authMiddleware, customerController.getCustomerById);

module.exports = router;
