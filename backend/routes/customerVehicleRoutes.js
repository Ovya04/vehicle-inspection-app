const express = require('express');
const customerVehicleController = require('../controllers/customerVehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadHandler');

const router = express.Router();

router.use(authMiddleware);

// Customer routes
router.get('/my-vehicles', customerVehicleController.getMyVehicles);
router.post('/upload', upload.single('image'), customerVehicleController.uploadVehicle);
router.get('/:vehicleId', customerVehicleController.getVehicleDetail);

// Admin/Inspector routes
router.get('/all/pending', customerVehicleController.getPendingVehicles);
router.patch('/:vehicleId/status', customerVehicleController.updateVehicleStatus);
router.patch('/:vehicleId/assign-inspector', customerVehicleController.assignInspector);

module.exports = router;