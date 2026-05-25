const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Please provide a customer ID'],
    },
    vehicleName: {
      type: String,
      required: [true, 'Please provide a vehicle name'],
      trim: true,
    },
    vehicleType: {
      type: String,
      default: 'Truck',
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
