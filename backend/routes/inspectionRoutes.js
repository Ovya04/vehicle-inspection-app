const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, inspectionController.getAllInspections);
router.get('/vehicle/:vehicleId', authMiddleware, inspectionController.getInspectionByVehicle);
router.post('/vehicle/:vehicleId', authMiddleware, inspectionController.createOrUpdateInspection);
router.put('/vehicle/:vehicleId', authMiddleware, inspectionController.createOrUpdateInspection);
router.patch('/vehicle/:vehicleId/status', authMiddleware, inspectionController.updateInspectionStatus);

module.exports = router;
