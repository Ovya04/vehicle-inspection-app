const Inspection = require('../models/Inspection');
const Vehicle = require('../models/Vehicle');

// Get all inspections
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().populate('vehicleId');
    res.status(200).json({
      count: inspections.length,
      inspections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inspection by vehicle ID
exports.getInspectionByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const inspection = await Inspection.findOne({ vehicleId });
    if (!inspection) {
      return res.status(200).json({
        message: 'No inspection found, creating new template',
        inspection: {
          vehicleId,
          tires: {},
          battery: {},
          exterior: {},
          brakes: {},
          engine: {},
        },
      });
    }

    res.status(200).json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update inspection
exports.createOrUpdateInspection = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const inspectionData = req.body;

    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    let inspection = await Inspection.findOne({ vehicleId });

    if (inspection) {
      // Update existing inspection
      Object.assign(inspection, inspectionData);
      await inspection.save();
      return res.status(200).json({
        message: 'Inspection updated successfully',
        inspection,
      });
    } else {
      // Create new inspection
      inspection = await Inspection.create({
        vehicleId,
        ...inspectionData,
      });

      return res.status(201).json({
        message: 'Inspection created successfully',
        inspection,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inspection status
exports.updateInspectionStatus = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    const inspection = await Inspection.findOneAndUpdate(
      { vehicleId },
      { status },
      { new: true }
    );

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.status(200).json({
      message: 'Inspection status updated successfully',
      inspection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
