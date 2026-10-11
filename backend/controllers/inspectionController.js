const Inspection = require('../models/Inspection');
const Vehicle = require('../models/Vehicle');

exports.getAllInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find()
      .populate('vehicleId')
      .populate(
        'customerId',
        'name email phone companyName companyAddress'
      )
      .populate(
        'inspectorId',
        'name email'
      )
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
exports.getPendingInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find({
      status: 'Pending',
      inspectorId: null,
    })
      .populate('vehicleId')
      .populate(
        'customerId',
        'name email phone companyName companyAddress'
      )
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: inspections.length,
      inspections,
    });
  } catch (error) {
    next(error);
  }
};
exports.assignInspection = async (req, res, next) => {
  try {
    const { inspectionId } = req.params;

    const inspection = await Inspection.findOneAndUpdate(
      {
        _id: inspectionId,
        status: 'Pending',
        inspectorId: null,
      },
      {
        inspectorId: req.user.id,
        status: 'Assigned',
        assignedAt: new Date(),
      },
      {
        new: true,
      }
    )
      .populate('vehicleId')
      .populate(
        'customerId',
        'name email phone companyName companyAddress'
      );

    if (!inspection) {
      return res.status(409).json({
        message:
          'This inspection has already been accepted by another inspector.',
      });
    }

    res.status(200).json({
      message: 'Inspection assigned successfully',
      inspection,
    });
  } catch (error) {
    next(error);
  }
};
exports.getMyInspections = async (req, res, next) => {
  try {
    const inspections = await Inspection.find({
      inspectorId: req.user.id,
      status: {
        $in: ['Assigned', 'In Progress'],
      },
    })
      .populate('vehicleId')
      .populate(
        'customerId',
        'name email phone companyName companyAddress'
      )
      .sort({ assignedAt: -1 });

    res.status(200).json({
      count: inspections.length,
      inspections,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateInspectionStatus = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    if (!['Pending','Assigned', 'Completed', 'In Progress'].includes(status)) {
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

exports.updateInspectionStatus = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'Pending',
      'Assigned',
      'In Progress',
      'Completed',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
      });
    }

    const updateData = {
      status,
    };

    if (status === 'In Progress') {
      updateData.startedAt = new Date();
    }

    if (status === 'Completed') {
      updateData.completedAt = new Date();
    }

    const inspection = await Inspection.findOneAndUpdate(
      { vehicleId },
      updateData,
      { new: true }
    );

    if (!inspection) {
      return res.status(404).json({
        message: 'Inspection not found',
      });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      inspection,
    });
  } catch (error) {
    next(error);
  }
};