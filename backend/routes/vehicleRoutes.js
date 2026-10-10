const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, vehicleValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/', authMiddleware, vehicleController.getAllVehicles);
router.post('/', authMiddleware, vehicleValidation, validateRequest, vehicleController.createVehicle);
router.get('/customer/:customerId', authMiddleware, vehicleController.getVehiclesByCustomer);
router.put('/:id', authMiddleware, vehicleController.updateVehicle);
router.delete('/:id', authMiddleware, vehicleController.deleteVehicle);

module.exports = router;