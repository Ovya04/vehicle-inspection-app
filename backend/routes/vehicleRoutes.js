const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, vehicleController.getAllVehicles);
router.get('/customer/:customerId', authMiddleware, vehicleController.getVehiclesByCustomer);
router.post('/', authMiddleware, vehicleController.createVehicle);

module.exports = router;
