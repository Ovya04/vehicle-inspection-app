const CustomerVehicle = require('../models/CustomerVehicle');
const fs = require('fs');
const path = require('path');

exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await CustomerVehicle.find({ customerId: req.user.id })
      .populate('assignedInspector', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    next(error);
  }
};

exports.uploadVehicle = async (req, res, next) => {
  try {
    const { make, model, year, vin, color, mileage } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const vehicle = await CustomerVehicle.create({
      customerId: req.user.id,
      make,
      model,
      year,
      vin,
      color,
      mileage,
      imageUrl,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Vehicle uploaded successfully. Awaiting approval.',
      vehicle,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(path.join('./uploads', req.file.filename), () => {});
    }
    next(error);
  }
};

exports.getVehicleDetail = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await CustomerVehicle.findById(vehicleId)
      .populate('assignedInspector', 'name email phone')
      .populate('customerId', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicleStatus = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { status, rejectionReason } = req.body;

    const vehicle = await CustomerVehicle.findByIdAndUpdate(
      vehicleId,
      {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      message: `Vehicle status updated to ${status}`,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

exports.assignInspector = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { inspectorId } = req.body;

    const vehicle = await CustomerVehicle.findByIdAndUpdate(
      vehicleId,
      {
        assignedInspector: inspectorId,
        status: 'inspecting',
      },
      { new: true }
    ).populate('assignedInspector', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      message: 'Inspector assigned successfully',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPendingVehicles = async (req, res, next) => {
  try {
    const vehicles = await CustomerVehicle.find({ status: 'pending' })
      .populate('customerId', 'name email phone companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    next(error);
  }
};