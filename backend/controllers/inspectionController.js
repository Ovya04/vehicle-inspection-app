const Inspection = require('../models/Inspection');
const Vehicle = require('../models/Vehicle');

exports.getAllInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find()
      .populate('vehicleId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: inspections.length,
      inspections,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInspectionByVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const inspection = await Inspection.findOne({ vehicleId })
      .populate('vehicleId');

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.status(200).json(inspection);
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateInspection = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const inspectionData = req.body;

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update or create inspection
    let inspection = await Inspection.findOne({ vehicleId });

    if (inspection) {
      // Update existing
      Object.assign(inspection, inspectionData);
      await inspection.save();
      res.status(200).json({
        message: 'Inspection updated successfully',
        inspection,
      });
    } else {
      // Create new
      inspection = await Inspection.create({
        vehicleId,
        ...inspectionData,
      });
      res.status(201).json({
        message: 'Inspection created successfully',
        inspection,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateInspectionStatus = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Completed', 'In Progress'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inspection = await Inspection.findOneAndUpdate(
      { vehicleId },
      { status },
      { new: true }
    );

    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      inspection,
    });
  } catch (error) {
    next(error);
  }
};