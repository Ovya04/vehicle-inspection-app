const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('customerId');
    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vehicles by customer ID
exports.getVehiclesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const vehicles = await Vehicle.find({ customerId });
    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { customerId, vehicleName, vehicleType, imageUrl } = req.body;

    // Validate input
    if (!customerId || !vehicleName) {
      return res.status(400).json({ message: 'Please provide customerId and vehicleName' });
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      customerId,
      vehicleName,
      vehicleType,
      imageUrl,
    });

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
