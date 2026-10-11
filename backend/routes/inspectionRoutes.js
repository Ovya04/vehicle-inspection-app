const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Inspector work queue
router.get(
  '/pending',
  authMiddleware,
  inspectionController.getPendingInspections
);

router.get(
  '/my',
  authMiddleware,
  inspectionController.getMyInspections
);

router.patch(
  '/:inspectionId/assign',
  authMiddleware,
  inspectionController.assignInspection
);

// Existing inspection routes
router.get(
  '/',
  authMiddleware,
  inspectionController.getAllInspections
);

router.get(
  '/vehicle/:vehicleId',
  authMiddleware,
  inspectionController.getInspectionByVehicle
);

router.post(
  '/vehicle/:vehicleId',
  authMiddleware,
  inspectionController.createOrUpdateInspection
);

router.put(
  '/vehicle/:vehicleId',
  authMiddleware,
  inspectionController.createOrUpdateInspection
);

router.patch(
  '/vehicle/:vehicleId/status',
  authMiddleware,
  inspectionController.updateInspectionStatus
);

module.exports = router;