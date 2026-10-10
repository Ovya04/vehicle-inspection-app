const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('customerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVehiclesByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const vehicles = await Vehicle.find({ customerId })
      .populate('customerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const { customerId, make, model, year, vin, color, mileage } = req.body;

    const vehicle = await Vehicle.create({
      customerId,
      make,
      model,
      year,
      vin,
      color,
      mileage,
    });

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customerId');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};